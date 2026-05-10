#!/bin/bash

cd ../terraform

terraform output -raw ec2_public_ip > ../ansible/host_ip

cd ../ansible

IP=$(cat host_ip)

echo "[web]" > inventory.ini
echo "$IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/devops-key.pem" >> inventory.ini
