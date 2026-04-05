## Create github ssh connect
```
create SSH key- ssh-keygen -t ed25519 -C "your_email@example.com"
Start SSH agent: eval "$(ssh-agent -s)"
Add key to agent: ssh-add ~/.ssh/id_ed25519
Copy public key: cat ~/.ssh/id_ed25519.pub
Copy full output
Add key to GitHub
Go to: GitHub → Settings → SSH and GPG keys → New SSH Key 
    Title: EC2 Server
    Paste key
    Save
Try clone again: git clone git@github.com:akashsakore/nucleus.git
```

## Install AWS CLI v2 (Official)
```
Download AWS CLI: curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
Install Unzip: sudo apt install unzip -y
  unzip awscliv2.zip
Install AWS: sudo ./aws/install
Verify: aws --version
```

# Install Docker
```
sudo apt-get update 
sudo apt install docker.io
docker ps
sudo chown $USER /var/run/docker.sock
```
## Install kubectl (Kubernetes CLI)
```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client
```
## Install eksctl
```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp && sudo mv /tmp/eksctl /usr/local/bin
```
## setup cluster
```
eksctl create cluster --name three-tier-cluster --region us-east-1 --node-type t3.micro --nodes 2 --nodes-min 1 --nodes-max 3 --managed
aws eks update-kubeconfig --region us-east-1 --name three-tier-cluster
kubectl get nodes
```
## Verify cluster
```
kubectl cluster-info
kubectl get all -A
```
# Delete resources 
## Delete cluster
```
kubectl delete all --all --all-namespaces
eksctl delete cluster --name three-tier-cluster --region us-east-1
eksctl get cluster --region us-east-1
```
## Delete ECR
```
aws ecr describe-repositories --region us-east-1
aws ecr delete-repository --repository-name three-tier-frontend/backend --region us-east-1 --force
aws ecr describe-repositories --region us-east-1
```
## Delete EC2 Instance (AWS CLI)
```
aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId" --output text
aws ec2 terminate-instances --instance-ids i-0abc12345xyz --region us-east-1
aws ec2 describe-instances --instance-ids i-0abc12345xyz
```
