#!/bin/bash
# Check if root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (or using sudo curl...)"
  exit
fi

echo "==> Creating officebot user and setting up shell"
useradd -m -s /usr/bin/fish officebot
usermod -aG sudo officebot

echo "==> Installing fish and docker"
apt-get update
apt-get install -y fish curl
curl -fsSL https://get.docker.com | bash
apt-get install -y docker-compose-plugin
usermod -aG docker officebot

echo "==> Creating Yugo project directory"
mkdir -p /home/officebot/yugo
chown -R officebot:officebot /home/officebot/yugo

echo "==> Finished base bootstrap. Now add SSH keys for 'officebot'!"
