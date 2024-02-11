import logging
import typing as t
from argparse import ArgumentParser, Namespace
from json import loads
from logging import Formatter, StreamHandler 
from math import floor
from os import environ, getenv
from subprocess import run as subproccess_run
from sys import exit, stdout


# Wrapper for ArgoCD CLI
# https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd/
class ArgoCDeployer:
    def __init__(self, application: str, docker_tag: str) -> None:
        self.application = application or getenv('ARGO_CD_APPLICATION', environ['DEPLOYMENT'])
        self.docker_tag = docker_tag or environ['DOCKER_TAG']
        self.image_tag_parameter = getenv('IMAGE_TAG_PARAMETER', 'global.image.tag=')
        self.argo_cd_credentials = [
            f'--username={environ["ARGO_CD_USERNAME"]}',
            f'--password={environ["ARGO_CD_PASSWORD"]}',
        ]

    def _execute_cli(self, command: t.List[str], return_stdout: bool = False) -> t.Optional[str]:
        command = ['argocd'] + command
        LOG.info(' '.join(command).replace(environ['ARGO_CD_PASSWORD'], 'redacted'))
        output = subproccess_run(command, capture_output=True, encoding='utf-8')
        if output.returncode != 0:
            LOG.fatal(f'ArgoCD CLI failed {command=} returncode={output.returncode} standard_error={output.stderr}')
        if return_stdout:
            return output.stdout

    def login(self):
        self._execute_cli(
            command=[
                'login',
                '--grpc-web',
                environ['ARGO_CD_SERVER'],
                *self.argo_cd_credentials,
            ]
        )

    def update_image_tag(self):
        args = []
        parameters = [
            f'{self.image_tag_parameter}{self.docker_tag}',
        ]
        for parameter in parameters:
            args.extend(['--parameter', parameter])
        self._execute_cli(command=['app', 'set', self.application, *args])

    def sync_app(self, preview: bool = False, timeout: int = 1200):
        args = [
            '--assumeYes',
            '--prune',
            '--retry-backoff-max-duration',
            f'{floor(timeout/60)}m',
            '--timeout',
            str(timeout + 30),
        ]
        if preview:
            args.append('--dry-run')
        self._execute_cli(command=['app', 'sync', self.application, *args])

    def preview_deploy(self):
        self.sync_app(preview=True)

    def wait_health(self):
        args = [
            '--health',
            '--sync',
            '--timeout',
            '600',
        ]
        self._execute_cli(command=['app', 'wait', self.application, *args])

    def verify_health(self):
        args = [
            '--output',
            'json',
        ]
        info = self._execute_cli(command=['app', 'get', self.application, *args], return_stdout=True)
        info = loads(info)
        status = info['status']
        if status['health']['status'] == 'Degraded':
            LOG.critical(
                f'Application is unhealthy, aborting deploy\nCheck Application https://ARGO_CD_SERVER/applications/argocd/{self.application}?view=network&resource='
            )
            exit(1)
        sync_status = status['sync']['status']
        if sync_status not in ['Synced', 'OutofSync']:
            LOG.info('Application non-deployable SyncStatus={sync_status} - Will try to wait before aborting')
            self.wait_health()


def Logger(logger_name):
    logger = logging.getLogger(logger_name)

    logger.setLevel(logging.INFO)

    standard_output = StreamHandler(stdout)
    standard_output.setFormatter(
        Formatter(
            '{asctime} {name} {levelname:8} {message}',
            '%Y-%m-%d %H:%M:%S',
            '{',
        )
    )
    logger.addHandler(standard_output)
    return logger


if __name__ == '__main__':
    LOG = Logger('argocd.deploy')

    parser = ArgumentParser(
        prog='ArgoCDeployer',
        description='Deploy ArgoCD Applications utilizing argocd CLI',
    )
    # TODO: Convert arguments to non-positional args and enforce required=True
    # Requires CICD changes where command is utilized
    parser.add_argument('--application', help='ArgoCD Application Name i.e., foobar-dev')
    parser.add_argument('--docker_tag', help='Docker Tag to be deployed, usually the full Git SHA')
    args: Namespace = parser.parse_args()

    argocd = ArgoCDeployer(application=args.application, docker_tag=args.docker_tag)
    argocd.login()
    argocd.verify_health()
    argocd.update_image_tag()
    argocd.sync_app()

    LOG.info(f'Deploy succeeded {args.application} docker_tag={args.docker_tag}')
