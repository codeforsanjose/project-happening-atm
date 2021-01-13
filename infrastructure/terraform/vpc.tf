resource "aws_vpc" "gan_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "gan_subnet1" {
  vpc_id            = "${aws_vpc.gan_vpc.id}"
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.region}a"
}

resource "aws_subnet" "gan_subnet2" {
  vpc_id            = "${aws_vpc.gan_vpc.id}"
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.region}b"
}

resource "aws_subnet" "gan_subnet3" {
  vpc_id     = "${aws_vpc.gan_vpc.id}"
  cidr_block = "10.0.3.0/24"
  // Subnets can currently only be created in the following availability zones: us-west-1a, us-west-1b.
  availability_zone = "${var.region}b"
}

resource "aws_db_subnet_group" "gan_db_subnet" {
  name       = "main"
  subnet_ids = ["${aws_subnet.gan_subnet1.id}", "${aws_subnet.gan_subnet2.id}", "${aws_subnet.gan_subnet3.id}"]
}

resource "aws_security_group" "gan_sg" {
  name        = "GAN Security Group"
  description = "Security group for AWS lambda and AWS RDS connections"
  vpc_id      = "${aws_vpc.gan_vpc.id}"
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
