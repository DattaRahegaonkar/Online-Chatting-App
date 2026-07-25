

resource "aws_security_group" "tf-baston-sg" {
  name        = "baston-sg"
  vpc_id      = aws_vpc.tf-chatapp-vpc.id

  ingress {
    description = "Allow SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow jenkins access"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow jenkins access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Baston-sg"
  }

}

resource "aws_security_group" "tf-app-sg" {
  name        = "app-sg"
  vpc_id      = aws_vpc.tf-chatapp-vpc.id

  ingress {
    description = "Allow SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    security_groups = [aws_security_group.tf-baston-sg.id]
  }

  ingress {
    description = "Allow http access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    security_groups = [aws_security_group.tf-alb-sg.id]
  }

  ingress {
    description = "Allow SSH access"
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH access"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    security_groups = [aws_security_group.tf-alb-sg.id]
  }

  ingress {
    description = "Allow SSH access"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    security_groups = [aws_security_group.tf-alb-sg.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-sg"
  }

}

resource "aws_key_pair" "tf-ssh-key"  {
  
  key_name   = "chatapp-key"
  public_key = file("chatapp-key.pub")

}

resource "aws_instance" "tf-baston-host" {
  ami = "ami-06468be052a4195a6"
  instance_type = "c7i-flex.large"
  key_name = aws_key_pair.tf-ssh-key.key_name
  subnet_id = aws_subnet.tf-public-subnet-1.id
  vpc_security_group_ids = [aws_security_group.tf-baston-sg.id]

  root_block_device {
    volume_size = 10
    volume_type = "gp3"
  }

  tags = {
    Name = "Baston-Host"
  }

}

resource "aws_instance" "tf-app-server" {
  ami = "ami-06468be052a4195a6"
  instance_type = "c7i-flex.large"
  key_name = aws_key_pair.tf-ssh-key.key_name
  subnet_id = aws_subnet.tf-private-subnet-1.id
  vpc_security_group_ids = [aws_security_group.tf-app-sg.id]

  root_block_device {
    volume_size = 15
    volume_type = "gp3"
  }

  tags = {
    Name = "App-server"
  }

}