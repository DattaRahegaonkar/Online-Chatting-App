resource "aws_security_group" "tf-alb-sg" {
  name        = "alb-sg"
  vpc_id      = aws_vpc.tf-chatapp-vpc.id

  ingress {
    description = "Allow http access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow https access"
    from_port   = 443
    to_port     = 443
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
    Name = "ALB-sg"
  }

}

resource "aws_lb" "tf-app-alb" {
  name               = "chatapp-alb"
  load_balancer_type = "application"
  internal           = false

  security_groups = [aws_security_group.tf-alb-sg.id]

  subnets = [
    aws_subnet.tf-public-subnet-1.id,
    aws_subnet.tf-public-subnet-2.id
  ]
}

resource "aws_lb_target_group" "tf-app-tg" {
  name     = "chatapp-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.tf-chatapp-vpc.id

  health_check {
    path = "/health"
  }
}

resource "aws_lb_target_group" "tf-grafana-tg" {
  name     = "grafana-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.tf-chatapp-vpc.id

  health_check {
    path = "/login"
  }
}

resource "aws_lb_target_group" "tf-prometheus-tg" {
  name     = "prometheus-tg"
  port     = 9090
  protocol = "HTTP"
  vpc_id   = aws_vpc.tf-chatapp-vpc.id

  health_check {
    path = "/-/healthy"
  }
}

resource "aws_lb_target_group_attachment" "app" {
  target_group_arn = aws_lb_target_group.tf-app-tg.arn
  target_id        = aws_instance.tf-app-server.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "grafana" {
  target_group_arn = aws_lb_target_group.tf-grafana-tg.arn
  target_id        = aws_instance.tf-app-server.id
  port             = 3000
}

resource "aws_lb_target_group_attachment" "prometheus" {
  target_group_arn = aws_lb_target_group.tf-prometheus-tg.arn
  target_id        = aws_instance.tf-app-server.id
  port             = 9090
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.tf-app-alb.arn

  port     = 80
  protocol = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.tf-app-alb.arn

  port     = 443
  protocol = "HTTPS"

  ssl_policy = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  certificate_arn = "arn:aws:acm:eu-west-1:972841066657:certificate/84215505-63c9-424b-a8a7-1cb5971f97e5"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tf-app-tg.arn
  }
}

resource "aws_lb_listener_rule" "grafana" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tf-grafana-tg.arn
  }

  condition {
    host_header {
      values = ["grafana.rahegaonkar.site"]
    }
  }
}

resource "aws_lb_listener_rule" "prometheus" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tf-prometheus-tg.arn
  }

  condition {
    host_header {
      values = ["prometheus.rahegaonkar.site"]
    }
  }
}


resource "aws_lb_listener_rule" "acme_challenge" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tf-app-tg.arn
  }

  condition {
    path_pattern {
      values = ["/.well-known/acme-challenge/*"]
    }
  }
}