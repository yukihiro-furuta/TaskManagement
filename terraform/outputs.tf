output "app_public_ip" {
  description = "アプリサーバーのパブリックIPアドレス"
  value       = aws_eip.app.public_ip
}

output "app_public_dns" {
  description = "アプリサーバーのパブリックDNS"
  value       = aws_eip.app.public_dns
}

output "app_url" {
  description = "アプリのアクセスURL"
  value       = "http://${aws_eip.app.public_ip}"
}

output "ssh_command" {
  description = "SSHログインコマンド"
  value       = "ssh -i <秘密鍵>.pem ec2-user@${aws_eip.app.public_ip}"
}
