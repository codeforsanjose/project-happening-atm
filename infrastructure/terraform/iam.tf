// The initial role assumption that facilitates other policies
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
  }
  version = "2012-10-17"
}

data "aws_iam_policy_document" "lambda_log_policy" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

# data "aws_iam_policy_document" "lambda_rds_policy" {
#   statement {
#     sid       = "gan-db"
#     resources = ["${aws_db_instance.gan_db.arn}"]
#     effect    = "Allow"
#     actions   = [
#       "rds:ModifyDBInstance",
#       "rds-db:connect"
#     ]
#   }
# }

resource "aws_iam_role" "gan_graphql_lambda" {
  # name               = "lambda-vpc-execution-role"
  assume_role_policy = "${data.aws_iam_policy_document.lambda_assume_role.json}"
}

resource "aws_iam_role_policy" "lambda_logging" {
  name   = "lambda_logging"
  policy = "${data.aws_iam_policy_document.lambda_log_policy.json}"
  role   = "${aws_iam_role.gan_graphql_lambda.id}"
}

resource "aws_iam_role_policy_attachment" "vpc_access_execution_policy" {
  # role       = "${aws_iam_role.gan_graphql_lambda.name}"
  role       = "${aws_iam_role.gan_graphql_lambda.id}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
