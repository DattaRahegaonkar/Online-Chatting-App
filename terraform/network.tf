
resource "aws_vpc" "tf-chatapp-vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "chatapp-vpc"
  }
}

resource "aws_subnet" "tf-public-subnet-1" {
  vpc_id     = aws_vpc.tf-chatapp-vpc.id
  cidr_block = "10.0.0.0/24"
  availability_zone = "eu-west-1a"

  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1"
  }
}

resource "aws_subnet" "tf-public-subnet-2" {
  vpc_id     = aws_vpc.tf-chatapp-vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-west-1b"

  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-2"
  }
}

resource "aws_subnet" "tf-private-subnet-1" {
  vpc_id     = aws_vpc.tf-chatapp-vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-west-1a"

  tags = {
    Name = "private-subnet-1"
  }
}

resource "aws_subnet" "tf-private-subnet-2" {
  vpc_id     = aws_vpc.tf-chatapp-vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "eu-west-1b"

  tags = {
    Name = "private-subnet-2"
  }
}

resource "aws_internet_gateway" "tf-igw" {
  vpc_id = aws_vpc.tf-chatapp-vpc.id

  tags = {
    Name = "Internet-Gateway"
  }
}

resource "aws_default_route_table" "tf-main-rt" {
  default_route_table_id = aws_vpc.tf-chatapp-vpc.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.tf-igw.id
  }

  tags = {
    Name = "Main-Route-Table"
  }
}

resource "aws_eip" "nat_eip" {

    domain = "vpc"

    tags = {
        Name = "Nat_Eip"
    }
}

resource "aws_nat_gateway" "tf-ngw" {

    allocation_id = aws_eip.nat_eip.id

    subnet_id = aws_subnet.tf-public-subnet-1.id

    depends_on = [
        aws_internet_gateway.tf-igw
    ]

    tags = {
        Name = "Nat-Gateway"
    }

}

resource "aws_route_table" "tf-private-rt" {
  vpc_id = aws_vpc.tf-chatapp-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.tf-ngw.id
  }

  tags = {
    Name = "Private-Route-Table"
  }
}

resource "aws_route_table_association" "tf-public-subnet-association-1" {
  subnet_id      = aws_subnet.tf-public-subnet-1.id
  route_table_id = aws_default_route_table.tf-main-rt.id
}

resource "aws_route_table_association" "tf-public-subnet-association-2" {
  subnet_id      = aws_subnet.tf-public-subnet-2.id
  route_table_id = aws_default_route_table.tf-main-rt.id
}

resource "aws_route_table_association" "tf-private-subnet-association-1" {
  subnet_id      = aws_subnet.tf-private-subnet-1.id
  route_table_id = aws_route_table.tf-private-rt.id
}

resource "aws_route_table_association" "tf-private-subnet-association-2" {
  subnet_id      = aws_subnet.tf-private-subnet-2.id
  route_table_id = aws_route_table.tf-private-rt.id
}
