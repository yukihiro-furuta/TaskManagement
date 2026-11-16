# このファイルを terraform.tfvars にコピーして値を書き換えてください
# terraform.tfvars は .gitignore で除外されています（秘密情報を含むため）

aws_region     = "ap-northeast-1"
app_name       = "task-management"
instance_type  = "t2.micro"

# ssh_public_key: ~/.ssh/id_rsa.pub の内容を貼り付けてください
# 例: "ssh-rsa AAAAB3NzaC1yc2EAAA... user@host"
ssh_public_key = "ssh-rsa YOUR_PUBLIC_KEY_HERE"
