resource "aws_vpc" "demovpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "demo_subnet1" {
  vpc_id            = "${aws_vpc.demovpc.id}"
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.region}a"
}

resource "aws_subnet" "demo_subnet2" {
  vpc_id            = "${aws_vpc.demovpc.id}"
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.region}b"
}

resource "aws_subnet" "demo_subnet3" {
  vpc_id     = "${aws_vpc.demovpc.id}"
  cidr_block = "10.0.3.0/24"
  // Subnets can currently only be created in the following availability zones: us-west-1a, us-west-1b.
  availability_zone = "${var.region}b"
}

resource "aws_db_subnet_group" "demo_dbsubnet" {
  name       = "main"
  subnet_ids = ["${aws_subnet.demo_subnet1.id}", "${aws_subnet.demo_subnet2.id}", "${aws_subnet.demo_subnet3.id}"]
}

resource "aws_security_group" "demosg" {
  name        = "demosg"
  description = "Demo security group for AWS lambda and AWS RDS connection"
  vpc_id      = "${aws_vpc.demovpc.id}"
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["127.0.0.1/32"]
    self        = true
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
