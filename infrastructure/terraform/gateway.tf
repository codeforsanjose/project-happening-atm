resource "aws_api_gateway_rest_api" "gan_graphql_api" {
  name        = "gan_graphql_api-${terraform.workspace}-gateway"
  description = "This is my API for demonstration purposes"
}

resource "aws_api_gateway_deployment" "dev" {
  rest_api_id = "${aws_api_gateway_rest_api.gan_graphql_api.id}"
  stage_name  = "dev"

  depends_on = [
    "aws_api_gateway_integration.gan",
  ]
}

resource "aws_api_gateway_resource" "gan_graphql_api_proxy" {
  parent_id   = "${aws_api_gateway_rest_api.gan_graphql_api.root_resource_id}"
  path_part   = "{proxy+}"
  rest_api_id = "${aws_api_gateway_rest_api.gan_graphql_api.id}"
}

resource "aws_api_gateway_method" "gan" {
  http_method      = "ANY"
  resource_id      = "${aws_api_gateway_resource.gan_graphql_api_proxy.id}"
  rest_api_id      = "${aws_api_gateway_rest_api.gan_graphql_api.id}"
  authorization    = "NONE"
  api_key_required = false

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "gan" {
  http_method             = "${aws_api_gateway_method.gan.http_method}"
  resource_id             = "${aws_api_gateway_resource.gan_graphql_api_proxy.id}"
  rest_api_id             = "${aws_api_gateway_rest_api.gan_graphql_api.id}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.gan_graphql_lambda.invoke_arn}"

  depends_on = [
    "aws_api_gateway_method.gan",
  ]
}

resource "aws_lambda_permission" "apigateway_lambda_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.gan_graphql_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_deployment.dev.execution_arn}/*"
}
