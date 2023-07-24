# docker-bake.hcl

/*
 * Extract platform (arch) from current default host
 * Utilizes built-in var BAKE_LOCAL_PLATFORM
 * https://docs.docker.com/build/bake/file-definition/#built-in-variables
 *
 */
function hostArch {
    params = []
    result = element(split("/", BAKE_LOCAL_PLATFORM), 1)
}
/*
 * Docker Tagging variables
 *
 * Used to manage container images, and it's layers and cache
 * Best effort Tags for local development vs Github Actions build/publish
 * Local development: "latest"
 * Github Actions: "$(git rev-parse --short HEAD)" -> "abc1234"
 */
variable "AWS_ACCOUNT_ID" {}
variable "PRIVATE_REGISTRY" { default = "${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com" }
variable "REFERENCE" { default = "latest" }
variable "GITHUB_ACTIONS" { default = "false" }
variable "DOCKER_TAG" { default = notequal("false",GITHUB_ACTIONS) ? "${REFERENCE}": "latest" }
function "dockerTag" {
    params = [image, tag, prefix]
    result = concat(
                notequal(prefix, "") ?
                    ["${PRIVATE_REGISTRY}/${image}:${prefix}-${tag}"]:
                    ["${PRIVATE_REGISTRY}/${image}:${tag}"],
            )
}
/*
 * Cache Layers in Github Actions
 *
 * Utilize S3 cache if AWS cli credentials are present
 * More information
 * https://docs.docker.com/build/cache/backends/s3/
 */
variable "AWS_ACCESS_KEY_ID" { default = "false" }
variable "AWS_SECRET_ACCESS_KEY" { default = "false" }
variable "DOCKER_S3_CACHE" {
    default = "type=s3,mode=max,region=us-west-1,bucket=opensourcesanjose-cache"
}
function "dockerS3Cache" {
    params = [cacheid]
    result = and(
                notequal("false",AWS_ACCESS_KEY_ID),
                notequal("false",AWS_SECRET_ACCESS_KEY)
            ) ? join(",",
                    [
                        "${DOCKER_S3_CACHE}",
                        "name=${cacheid}",
                    ]
                ): ""
}
variable "OUTPUT" { # output to docker for local development rather than GHCR
    default = notequal("false",GITHUB_ACTIONS) ? "type=registry": "type=docker"
}

variable "CACHE_ID" {
    default = "docker-happeningatm-${hostArch()}"
}
target "_common" {
    output = ["${OUTPUT}"]
}

/*
 * Virtual Base Targets
 *
 * This section defines virtual base targets, which are shared across the
 * different dependent targets.
 */
target "frontend" {
    dockerfile = "docker/frontend/Dockerfile"
    context = "./"
    inherits = ["_common"]
    tags = dockerTag("happeningatm", "${DOCKER_TAG}", "frontend")
    cache-from = [dockerS3Cache("${CACHE_ID}-frontend")]
    cache-to   = [notequal("false",GITHUB_ACTIONS) ? dockerS3Cache("${CACHE_ID}-frontend"): ""]
}
target "backend" {
    dockerfile = "docker/backend/Dockerfile"
    context = "./"
    inherits = ["_common"]
    tags = dockerTag("happeningatm", "${DOCKER_TAG}-backend", "backend")
    cache-from = [dockerS3Cache("${CACHE_ID}")]
    cache-to   = [notequal("false",GITHUB_ACTIONS) ? dockerS3Cache("${CACHE_ID}-backend"): ""]
}
target "graphql" {
    dockerfile = "docker/graphql/Dockerfile"
    context = "./"
    inherits = ["_common"]
    tags = dockerTag("happeningatm", "${DOCKER_TAG}-graphql", "graphql")
    cache-from = [dockerS3Cache("${CACHE_ID}")]
    cache-to   = [notequal("false",GITHUB_ACTIONS) ? dockerS3Cache("${CACHE_ID}-graphql"): ""]
}
/*
 * Default Target(s) to build
 * https://docs.docker.com/build/bake/file-definition/#default-targetgroup
 * "docker buildx bake" == "docker buildx bake default"
 */
group "default" {
    targets = ["frontend", "backend", "graphql"]
}
