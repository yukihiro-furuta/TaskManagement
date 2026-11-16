variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "app_name" {
  description = "アプリ名（リソース命名に使用）"
  type        = string
  default     = "task-management"
}

variable "instance_type" {
  description = "EC2インスタンスタイプ（t2.micro = Free Tier対象）"
  type        = string
  default     = "t2.micro"
}

variable "ssh_public_key" {
  description = "EC2へのSSHアクセス用公開鍵（例: ~/.ssh/id_rsa.pub の内容）"
  type        = string
}
