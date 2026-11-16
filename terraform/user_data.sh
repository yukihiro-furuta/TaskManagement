#!/bin/bash
set -e

# システム更新
dnf update -y

# Docker インストール
dnf install -y docker git

# Docker 起動・自動起動設定
systemctl start docker
systemctl enable docker

# ec2-user を docker グループに追加
usermod -aG docker ec2-user

# Docker Compose プラグインのインストール
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# アプリ配置用ディレクトリ作成
mkdir -p /opt/app
chown ec2-user:ec2-user /opt/app

echo "Setup complete. Deploy your app to /opt/app and run: docker compose -f docker-compose.prod.yml up -d"
