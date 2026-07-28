# 💬 Online Chat Application | AWS | Terraform | Jenkins | Docker | Ansible

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?logo=terraform)
![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazonaws)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?logo=jenkins)
![Ansible](https://img.shields.io/badge/Ansible-Automation-EE0000?logo=ansible)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-F46800?logo=grafana&logoColor=white)

![Platform](https://img.shields.io/badge/Platform-AWS-orange)
![IaC](https://img.shields.io/badge/IaC-Terraform-purple)
![CI/CD](https://img.shields.io/badge/CI%2FCD-Jenkins-red)
![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%7C%20Grafana-orange)


## 📝 Introduction

The **Real-Time Online Chat Application** is a full-stack web application that enables users to communicate instantly through real-time messaging. It is built using modern technologies with a focus on scalability, security, and maintainability.

The project also demonstrates a complete **DevOps workflow** by provisioning AWS infrastructure with Terraform, configuring servers using Ansible, and automating deployments through Jenkins pipelines.

---

## ✨ Features

- 🚀 Real-time messaging using Socket.io
- 🔐 User Authentication & Authorization with JWT
- 👤 User Profile Management
- 🟢 Real-time Online/Offline Status
- 🎨 Modern UI built with React and TailwindCSS
- 📦 Containerized using Docker
- ☁️ Automated deployment using Jenkins & Ansible
- 🏗️ Infrastructure as Code using Terraform

---

## 🛠️ Tech Stack

### Frontend
- React
- TailwindCSS
- Zustand
- DaisyUI

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT

### DevOps & Cloud
- AWS EC2
- AWS VPC
- AWS ALB
- Terraform
- Jenkins
- Ansible
- Nginx
- Docker
- Docker Compose
- Prometheus
- Grafana

---

# 🔧 Prerequisites

Install the following before running the project locally:

- Node.js (v14 or higher)
- Docker
- Git

---

# 📝 Environment Configuration

Create a `.env` file inside the project root.

```env
# Database Configuration
MONGODB_URI=mongodb://root:admin@mongo:27017/chatApp?authSource=admin&retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5001
NODE_ENV=production

COOKIE_SECURE=false

CLIENT_ORIGIN=http://localhost,http://<ip>,http://<alb-dns>,http://<domain-name>
```

> **Note**
>
> Replace `your_jwt_secret_key` with a secure secret.
>
> For local development without Docker:
>
> ```text
> mongodb://localhost:27017/chatApp
> ```

---

## Project Structure
```bash
Online-Chatting-App
├── frontend/
├── backend/
├── ansible/
├── terraform/
├── monitoring/
├── Jenkinsfile-ansible
├── Jenkinsfile-deploy
├── docker-compose.yml
└── README.md
```

---

# 💻 Local Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/DattaRahegaonkar/Online-Chatting-App.git
```

### 2. Run Backend

```bash
cd Online-Chatting-App/backend
npm install
npm run dev
```

### 3. Run Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### Application URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5001
```

---

# 🐳 Docker Deployment

### Clone Repository

```bash
git clone https://github.com/DattaRahegaonkar/Online-Chatting-App.git
```

### Start Containers

```bash
cd Online-Chatting-App

docker compose up -d --build
```

### Access Application

```
http://localhost
```

### Verify Containers

```bash
docker ps
```

### View Logs

```bash
docker compose logs -f
```

---

# ☁️ AWS Infrastructure & CI/CD Deployment

## AWS Infrastructure

The infrastructure is provisioned using **Terraform**.

### AWS Services Used

- VPC
- Public Subnets
- Private Subnets
- Route Tables
- Application Load Balancer
- Internet Gateway
- Nat Gateway
- Bastion Host
- EC2 Application Server
- Security Groups

---

## Architecture

```text
                    Developer
                        │
                        ▼
                GitHub Repository
                        │
                 GitHub Webhook
                        │
                        ▼
            Jenkins (Bastion Host)
                        │
                        ▼
        Pipeline 1 (Install Packages)
                        │
                        ├── Clone Repository
                        ├── Run Ansible
                        ├── Install Java
                        ├── Install Docker
                        ├── Install Docker Compose
                        └──────────────┐
                                       │
                                       ▼
                        Trigger Pipeline 2
                                       │
                                       ▼
                App Server (Private Subnet)
                                       │
                                       ▼
          Pipeline 2 (Deploy Application)
                                       │
                                       ├── Clone Repository
                                       ├── Create .env
                                       ├── docker compose up -d
                                       └── Application Running
```

---

## Step 1 - Provision Infrastructure

Move into the Terraform directory.

```bash
cd terraform
```

Initialize Terraform.

```bash
terraform init
```

Validate the configuration.

```bash
terraform validate
```

Review the execution plan.

```bash
terraform plan
```

Provision the infrastructure.

```bash
terraform apply --auto-approve
```

---

## Step 2 - Install Jenkins on Bastion Host

Copy the installation script.

```bash
scp -i <private-key> jenkins-install.sh ubuntu@<bastion-public-ip>:.
```

SSH into the Bastion Host.

```bash
ssh -i <private-key> ubuntu@<bastion-public-ip>
```

Run the installation script.

```bash
chmod +x jenkins-install.sh

./jenkins-install.sh
```

Access Jenkins.

```
http://<bastion-public-ip>:8080
```

---

## Step 3 - Configure Jenkins Agent

### 1. SSH into the App Server

```bash
ssh -i <private-key> ubuntu@<app-server-private-ip>
```

### 2. Update the Package Index

```bash
sudo apt update
```

### 3. Install Java

```bash
sudo apt install openjdk-21-jre -y
```

Verify the installation:

```bash
java -version
```

---

### 4. Add the App Server as a Jenkins Agent

1. Open Jenkins Dashboard.

2. Navigate to:

```
Manage Jenkins
    └── Nodes
```

3. Click **New Node**.

4. Configure the node with the following details:

- **Node Name:** `app-server`
- **Type:** `Permanent Agent`
- **Remote Root Directory:** `/home/ubuntu/jenkins`
- **Labels:** `app-server`
- **Launch Method:** `Launch agents via SSH`
- **Host:** `<app-server-private-ip>`
- **Credentials:** `ubuntu` user with the EC2 private key
- **Host Key Verification Strategy:** `Non verifying Verification Strategy`

5. Click **Save**.

6. Jenkins will automatically connect to the App Server and install the agent (`remoting.jar`).

After the node status changes to **Online**, the App Server is ready to execute Jenkins pipelines.

---

## Step 4 - Configure SSH Key for Ansible

First, install Ansible on the Bastion Host.
```bash
sudo apt install ansible -y
```

Since Jenkins executes Ansible as the **jenkins** user, move the SSH private key into Jenkins' SSH directory.

```bash
sudo mkdir -p /var/lib/jenkins/.ssh

sudo mv /home/ubuntu/chatapp-key /var/lib/jenkins/.ssh/<private-key>

sudo chown -R jenkins:jenkins /var/lib/jenkins/.ssh

sudo chmod 700 /var/lib/jenkins/.ssh

sudo chmod 600 /var/lib/jenkins/.ssh/<private-key>
```

This allows Jenkins to securely SSH into the private App Server while executing Ansible playbooks.

### First-Time SSH Host Verification
```bash
sudo -u jenkins ssh -i /var/lib/jenkins/.ssh/<private-key> ubuntu@<ip-of-app-server>
```
> **Why?**
>
> During the first Ansible execution, SSH host verification must be completed once for the `jenkins` user. Type `yes` when prompted to add the App Server's fingerprint to the `known_hosts` file. Future Ansible executions will then connect automatically without prompting.

---

# 🚀 Jenkins Pipelines

## Pipeline 1 – Install Packages Using Ansible

This pipeline runs on the **Bastion Host**.

### Responsibilities

- Clone Repository
- Execute Ansible Playbook
- Install Java
- Install Docker
- Install Docker Compose
- Trigger Deployment Pipeline

Jenkinsfile

```
Jenkinsfile-ansible
```

---

## Pipeline 2 – Deploy Application on App Server

This pipeline runs on the **App Server**.

### Responsibilities

- Clone Repository
- Generate `.env`
- Pull Docker Images
- Deploy Application using Docker Compose

Jenkinsfile

```
Jenkinsfile-deploy
```
> **Note**
>
> During the initial bootstrap, Docker is installed and the `ubuntu` user is added to the `docker` group. Reconnect the Jenkins agent once so the updated group membership is applied. This is only required when provisioning a new App Server.

---

# ✅ Verify Deployment

Check running containers.

```bash
docker ps
```

View application logs.

```bash
docker compose logs -f
```

Open the application.

```bash
http://app.<domain-name>

OR

http://<alb-dns>
```

Monitoring Endpoints
```bash
Open the Grafana dashboard : http://grafana.<domain-name>

Verify Prometheus targets : http://prometheus.<domain-name>
```

---

## 📊 Monitoring & Observability

The application includes a monitoring stack deployed alongside the application using **Docker Compose**.

### Components

* **Chat Application** – Real-time messaging application.
* **Prometheus** – Collects application and infrastructure metrics.
* **Grafana** – Visualizes metrics through interactive dashboards.
* **Application Load Balancer (ALB)** – Routes incoming requests to the appropriate service using **host-based routing**.

### Access Services

| Service           | URL                               |
| ----------------- | --------------------------------- |
| Chat Application  | `http://<domain-name>`            |
| Grafana Dashboard | `http://grafana.<domain-name>`    |
| Prometheus        | `http://prometheus.<domain-name>` |

### Architecture

```text
                 App Server (Private Subnet)
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
Chat Application      Prometheus         Grafana
      │                   │                   │
      └───────────────────┼───────────────────┘
                          │
                          ▼
        Application Load Balancer (ALB)
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
 <domain-name>   prometheus.<domain-name>  grafana.<domain-name>
                          │
                          ▼
                        Users
```

> **Host-Based Routing**
>
> The Application Load Balancer uses host-based routing rules to expose multiple services through a single load balancer:
>
> * `<domain-name>` → Chat Application
> * `grafana.<domain-name>` → Grafana Dashboard
> * `prometheus.<domain-name>` → Prometheus Server

---

# 🔮 Future Improvements

- [ ] Deploy on Kubernetes (Amazon EKS)
- [ ] GitOps deployment using ArgoCD
- [ ] HTTPS using AWS ACM and Application Load Balancer
- [ ] Auto Scaling Group for high availability
- [ ] Centralized logging using Loki
- [ ] Automated Docker image build & push using GitHub Actions

---

# 📚 Project Snapshots

#### 📸 AWS Infrastructure
---

###### VPC

![vpc](project-snapshots/aws-infra/vpc.png)

---

###### Subnets

![subnets](project-snapshots/aws-infra/subnets.png)

---
###### Route Tables

![route-tables](project-snapshots/aws-infra/route-tables.png)

---

###### Internet Gateway

![internet-gateway](project-snapshots/aws-infra/igw.png)

---

###### Nat Gateway

![nat-gateway](project-snapshots/aws-infra/ngw.png)

---

###### Target groups

![target-groups](project-snapshots/aws-infra/target-groups.png)

---

###### ALB

![alb](project-snapshots/aws-infra/alb.png)
---

#### 📸 Jenkins Pipeline
---

###### Pipeline - 1

![Pipeline-1](project-snapshots/jenkins-pipelines/pipeline-1.png)

---

###### Pipeline - 2
![Pipeline-2](project-snapshots/jenkins-pipelines/pipeline-2.png)

---

#### 📸 Application
---

###### Settings

![Settings](project-snapshots/application/settings.png)

---

###### Chat

![Chat](project-snapshots/application/chat.png)

---

###### Sign Up

![Signup](project-snapshots/application/signup.png)

---

###### Login

![Login](project-snapshots/application/login.png)

#### 📸 Prometheus Targets (Health Check)
---

![prometheus-targets](project-snapshots/prometheus-targets/targets.png)

---

#### 📸 Grafana Dashboard
---

> **Note**
>
> This dashboard demonstrates that Grafana is successfully connected to Prometheus and receiving metrics. A custom application dashboard can be added for monitoring chat application metrics.

![grafana-dashboard](project-snapshots/grafana-dashboard/grafana-dashboard.png)

---

#### 📸 Running Docker Containers
---

![containers](project-snapshots/containers/containers.png)

---