output "ec2_public_ip" {
  value = aws_instance.devops_server.public_ip
}
