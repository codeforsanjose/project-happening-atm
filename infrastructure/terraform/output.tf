output "graphql_api_url" {
  value = "${aws_api_gateway_deployment.dev.invoke_url}"
}
