resource "aws_api_gateway_rest_api" "gan" {
  name        = "gan_api-${terraform.workspace}-gateway"
  description = "Government Agenda Notifier API Gateway"
}

resource "aws_api_gateway_deployment" "dev" {
  rest_api_id = "${aws_api_gateway_rest_api.gan.id}"
  stage_name  = "dev"

  depends_on = [
    "aws_api_gateway_integration.gan_graphql_api",
  ]
}


# GraphQL API route and lambda intergration
# -----------------------------------------
resource "aws_api_gateway_resource" "gan_graphql_api" {
  parent_id   = "${aws_api_gateway_rest_api.gan.root_resource_id}"
  path_part   = "agendapi"
  rest_api_id = "${aws_api_gateway_rest_api.gan.id}"
}

resource "aws_api_gateway_method" "gan_graphql_api" {
  http_method      = "ANY"
  resource_id      = "${aws_api_gateway_resource.gan_graphql_api.id}"
  rest_api_id      = "${aws_api_gateway_rest_api.gan.id}"
  authorization    = "NONE"
  api_key_required = false

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "gan_graphql_api" {
  http_method             = "${aws_api_gateway_method.gan_graphql_api.http_method}"
  resource_id             = "${aws_api_gateway_resource.gan_graphql_api.id}"
  rest_api_id             = "${aws_api_gateway_rest_api.gan.id}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.gan_graphql_lambda.invoke_arn}"

  depends_on = [
    "aws_api_gateway_method.gan_graphql_api",
  ]
}

resource "aws_lambda_permission" "invoke_graphql_api" {
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.gan_graphql_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_deployment.dev.execution_arn}/*"
}


# Agenda Upload service route and lambda intergration
# ---------------------------------------------------
resource "aws_api_gateway_resource" "gan_agenda_upload" {
  parent_id   = "${aws_api_gateway_rest_api.gan.root_resource_id}"
  path_part   = "upload"
  rest_api_id = "${aws_api_gateway_rest_api.gan.id}"
}

resource "aws_api_gateway_method" "gan_agenda_upload" {
  http_method      = "POST"
  resource_id      = "${aws_api_gateway_resource.gan_agenda_upload.id}"
  rest_api_id      = "${aws_api_gateway_rest_api.gan.id}"
  authorization    = "NONE"
  api_key_required = false

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "gan_agenda_upload" {
  http_method             = "${aws_api_gateway_method.gan_agenda_upload.http_method}"
  resource_id             = "${aws_api_gateway_resource.gan_agenda_upload.id}"
  rest_api_id             = "${aws_api_gateway_rest_api.gan.id}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.gan_agenda_upload_lambda.invoke_arn}"

  depends_on = [
    "aws_api_gateway_method.gan_agenda_upload",
  ]
}

resource "aws_lambda_permission" "invoke_agenda_upload" {
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.gan_agenda_upload_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_deployment.dev.execution_arn}/*"
}
