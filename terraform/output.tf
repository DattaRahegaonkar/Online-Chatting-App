
output "baston_host_public_ip" {
  value = aws_instance.tf-baston-host.public_ip
}

output "app_server_private_ip" {
  value = aws_instance.tf-app-server.private_ip
}

output "alb_dns" {
  value = aws_lb.tf-app-alb.dns_name
}