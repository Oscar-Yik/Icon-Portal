#!/bin/sh
echo "Current Date and Time: $(date)"
cd /home/azureuser/Terraform
sudo docker run --rm -it -v $PWD:/data -w /data hashicorp/terraform:1.9.2 destroy -auto-approve