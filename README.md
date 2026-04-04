## Create github ssh connect
```
Step 1: create SSH key- ssh-keygen -t ed25519 -C "your_email@example.com"

Step 2: Start SSH agent: eval "$(ssh-agent -s)"

Step 3: Add key to agent: ssh-add ~/.ssh/id_ed25519

Step 4: Copy public key: cat ~/.ssh/id_ed25519.pub

Copy full output

Step 5: Add key to GitHub

Go to: GitHub → Settings → SSH and GPG keys → New SSH Key 
    Title: EC2 Server
    Paste key
    Save

Step 7: Try clone again: git clone git@github.com:akashsakore/nucleus.git
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
