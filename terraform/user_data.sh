#!/bin/bash
set -e

# システム更新
dnf update -y

# ------------------------------------------------------------
# Git
# ------------------------------------------------------------
dnf install -y git

# ------------------------------------------------------------
# Java 21（Spring Boot 実行用）
# ------------------------------------------------------------
dnf install -y java-25-amazon-corretto-headless

# ------------------------------------------------------------
# Node.js 24（Vite フロントエンド実行用）
# ------------------------------------------------------------
curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -
dnf install -y nodejs

# ------------------------------------------------------------
# Docker（PostgreSQL をコンテナで動かす用）
# ------------------------------------------------------------
dnf install -y docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Docker Compose プラグイン
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# ------------------------------------------------------------
# アプリ配置用ディレクトリ
# ------------------------------------------------------------
mkdir -p /opt/app
chown ec2-user:ec2-user /opt/app

echo "Setup complete."
echo "  java  : $(java -version 2>&1 | head -1)"
echo "  node  : $(node -v)"
echo "  npm   : $(npm -v)"
echo "  docker: $(docker -v)"
