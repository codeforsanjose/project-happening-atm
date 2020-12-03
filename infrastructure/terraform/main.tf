provider "aws" {
  region = "${var.region}"
}

resource "aws_lambda_function" "gan_graphql_lambda" {
  depends_on = [
    aws_db_instance.gan_db,
    aws_cloudwatch_log_group.gan_graphql_lambda_log_group,
    aws_security_group.gan_sg,
    aws_subnet.gan_subnet1,
    aws_subnet.gan_subnet2,
    aws_subnet.gan_subnet3,
  ]

  function_name    = "gan_graphql_lambda"
  handler          = "handler.graphqlHandler"
  filename         = "../gan_graphql_lambda.zip"
  source_code_hash = filebase64sha256("../gan_graphql_lambda.zip")
  runtime          = "nodejs12.x"
  role             = "${aws_iam_role.gan_lambda.arn}"

  vpc_config {
    subnet_ids         = ["${aws_subnet.gan_subnet1.id}", "${aws_subnet.gan_subnet2.id}", "${aws_subnet.gan_subnet3.id}"]
    security_group_ids = "${list("${aws_security_group.gan_sg.id}")}"
  }

  environment {
    variables = {
      IS_LAMBDA = true
      NODE_ENV  = "development"

      TWILIO_AUTH_TOKEN   = "${var.TWILIO_AUTH_TOKEN}"
      TWILIO_ACCOUNT_SID  = "${var.TWILIO_ACCOUNT_SID}"
      TWILIO_PHONE_NUMBER = "${var.TWILIO_PHONE_NUMBER}"

      PGUSER     = "${var.PGUSER}"
      PGPASSWORD = "${var.PGPASSWORD}"
      PGDATABASE = "${aws_db_instance.gan_db.name}"
      PGHOST     = "${aws_db_instance.gan_db.address}"
      PGPORT     = "${aws_db_instance.gan_db.port}"
    }
  }
}

resource "aws_cloudwatch_log_group" "gan_graphql_lambda_log_group" {
  name              = "/aws/lambda/gan_graphql_lambda"
  retention_in_days = 14
}

resource "aws_lambda_function" "gan_agenda_upload_lambda" {
  depends_on = [
    aws_db_instance.gan_db,
    aws_cloudwatch_log_group.gan_agenda_upload_lambda_log_group,
    aws_security_group.gan_sg,
    aws_subnet.gan_subnet1,
    aws_subnet.gan_subnet2,
    aws_subnet.gan_subnet3,
  ]

  function_name    = "gan_agenda_upload_lambda"
  handler          = "handler.uploadHandler"
  filename         = "../gan_agenda_upload_lambda.zip"
  source_code_hash = filebase64sha256("../gan_agenda_upload_lambda.zip")
  runtime          = "nodejs12.x"
  role             = "${aws_iam_role.gan_lambda.arn}"

  vpc_config {
    subnet_ids         = ["${aws_subnet.gan_subnet1.id}", "${aws_subnet.gan_subnet2.id}", "${aws_subnet.gan_subnet3.id}"]
    security_group_ids = "${list("${aws_security_group.gan_sg.id}")}"
  }

  environment {
    variables = {
      IS_LAMBDA  = true
      PGUSER     = "${var.PGUSER}"
      PGPASSWORD = "${var.PGPASSWORD}"
      PGDATABASE = "${aws_db_instance.gan_db.name}"
      PGHOST     = "${aws_db_instance.gan_db.address}"
      PGPORT     = "${aws_db_instance.gan_db.port}"
    }
  }
}

resource "aws_cloudwatch_log_group" "gan_agenda_upload_lambda_log_group" {
  name              = "/aws/lambda/gan_agenda_upload_lambda"
  retention_in_days = 14
}

resource "aws_db_instance" "gan_db" {
  identifier             = "gan-db" # Name in AWS Console
  name                   = "gan"    # Database name the clients connect to in this instance
  username               = "${var.PGUSER}"
  password               = "${var.PGPASSWORD}"
  engine                 = "postgres"
  engine_version         = "11.5"
  instance_class         = "db.t2.micro"
  allocated_storage      = 20
  skip_final_snapshot    = true
  db_subnet_group_name   = "${aws_db_subnet_group.gan_db_subnet.id}"
  vpc_security_group_ids = "${list("${aws_security_group.gan_sg.id}")}"
}
