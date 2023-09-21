SHELL := /bin/bash -e -o pipefail

# Location of Docker images and Helm charts
AWS_ACCOUNT_ID ?= 000000000000
AWS_REGION ?= us-west-2

# Docker image build arguments
BUILD_ID := $(shell git rev-parse --short HEAD)
REFERENCE := $(shell git rev-parse HEAD)
COMMIT_SHA := ${REFERENCE}

# AWS EKS / Helm deployments
APPLICATION := happeningatm
ENVIRONMENT ?= dev
EKS_CLUSTER_NAME := shared-cluster-prod

.EXPORT_ALL_VARIABLES:

#   Docker local development
## ------------------------
build: aws-cli-creds
build: ## Build Docker image
	docker buildx bake --file docker-bake.hcl --print
	docker buildx bake --file docker-bake.hcl

#   Docker local development
## ------------------------
build-%: aws-cli-creds
build-%: ## Build Docker specific image
	docker buildx bake --file docker-bake.hcl --print $*
	docker buildx bake --file docker-bake.hcl $*

run: ## Run the app
	docker compose up -d

start-db: ## Start Postgres DB
	docker compose up postgres -d

logs: ## Tail docker compose logs
	docker compose logs -f

#   Docker utility commands
## ------------------------
buildx: ## Create Docker buildx instance
	-docker buildx create \
		--name cfsj \
		--bootstrap --use \
		--driver docker-container \
		--platform linux/amd64,linux/arm64

clean: ## Clean up old images, stopped containers, and other build artifacts for this service.
	-docker system prune -f -a --filter label='org.opensourcesanjose.app=happeningatm' ${EXTRA_CLEAN_ARGS}

scorched-earth: ## Factory reset. This will also remove the database volume!
	-docker compose down
	make clean
	docker volume rm happeningatm-db-data

login-ecr: ## Log into AWS Elastic Container Registry (ECR)
	aws ecr get-login-password --region us-west-2 | \
	docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com


#   Helm/Kubectl commands
## ------------------------
login-eks-cluster: ## Update kubeconfig for AWS EKS Cluster
	aws eks --region us-west-2 update-kubeconfig \
		--name ${EKS_CLUSTER_NAME}

deploy: login-eks-cluster
deploy: ## Deploy Helm chart into AWS EKS
	helm dependency update deployments/${APPLICATION}-${ENVIRONMENT}
	helm upgrade \
		--set global.image.tag=${COMMIT_SHA} \
		${APPLICATION}-${ENVIRONMENT} deployments/${APPLICATION}-${ENVIRONMENT} \
		--install --wait \
		--dependency-update \
		--namespace ${APPLICATION}-${ENVIRONMENT}

deploy-status: login-eks-cluster
deploy-status: ## View status of Helm release/deploy
	helm status \
		${APPLICATION}-${ENVIRONMENT} \
		--namespace ${APPLICATION}-${ENVIRONMENT} \
		--show-resources

logs-%: login-eks-cluster
logs-%: ## Tail logs for k8s deployment
	kubectl logs deploy/$* -c $* -n ${APPLICATION}-${ENVIRONMENT} -f

aws-cli-creds:
ifndef CI
	export AWS_ACCESS_KEY_ID=$(shell aws configure get cfsj.aws_access_key_id)
	export AWS_SECRET_ACCESS_KEY=$(shell aws configure get cfsj.aws_secret_access_key)
endif

help: ## Show this help.
	@sed -ne '/@sed/!s/## //p' $(MAKEFILE_LIST) | \
	sed -E 's/^([a-zA-Z0-9%_-]+):\s+(\w+)/$(GREEN)\1$(END_COLOR):~\u\2/' | \
	sed -E 's/(.*)(EX:)(.*)/\1$(YELLOW)\2\3$(END_COLOR)/' | \
	column -s '~' -t
