
# Real-Time Online Chat Application

## 📝 Introduction

This project aims to provide a real-time chat experience that's both scalable and secure. With a focus on modern technologies, we're building an application that's easy to use and maintain.

## ✨ Features


* **Real-time Messaging**: Send and receive messages instantly using Socket.io 
* **User Authentication & Authorization**: Securely manage user access with JWT 
* **Scalable & Secure Architecture**: Built to handle large volumes of traffic and data 
* **Modern UI Design**: A user-friendly interface crafted with React and TailwindCSS 
* **Profile Management**: Users can upload and update their profile pictures 
* **Online Status**: View real-time online/offline status of users 


## 🛠️ Tech Stack


* **Backend:** Node.js, Express, MongoDB, Socket.io
* **Frontend:** React, TailwindCSS
* **Containerization:** Docker
* **Orchestration:** Kubernetes (planned)
* **Web Server:** Nginx
* **State Management:** Zustand
* **Authentication:** JWT
* **Styling Components:** DaisyUI


### 🔧 Prerequisites


* **[Node.js](https://nodejs.org/)** (v14 or higher)
* **[Docker](https://www.docker.com/get-started)** (for containerizing the app)
* **[Git](https://git-scm.com/downloads)** (to clone the repository)


### 📝 Environment Configuration

Create a `.env` file in the root directory with the following configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://root:admin@mongo:27017/chatApp?authSource=admin&retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5001
NODE_ENV=production

# Cookie security: set to "false" when served over plain HTTP (no TLS).
# Required on this EC2 box until you add HTTPS, otherwise the browser drops the auth cookie.
COOKIE_SECURE=false

# Allowed browser origins for Socket.io (comma-separated).
# Must match the URL you open in the browser:
#   local docker stack  -> http://localhost   (nginx serves on :80)
#   EC2                 -> http://54.217.162.215
CLIENT_ORIGIN=http://localhost,http://3.252.96.253

```

> **Note:** 
> - Replace `your_jwt_secret_key` with a strong secret key
> - For local development without Docker, change `MONGODB_URI` to `mongodb://localhost:27017/chatApp`

### Local Deployment

1. Clone the Repository:
```bash
git clone https://github.com/DattaRahegaonkar/Online-Chatting-App.git
```

2. Move to `Online-Chatting-App/backend` Folder and install backend dependancies and run the backend
```bash
cd Online-Chatting-App/backend
npm install
npm run dev
```

3. Move to `../frontend` folder to install frontend dependancies and run the frontend
```bash
cd ../frontend
npm install
npm run dev
```

4. Application on
```bash
http://localhost:5173
```

5. Backend on
```bash
http://localhost:5001
```

### Docker Deployment

1. Clone the Repository
```bash
git clone https://github.com/DattaRahegaonkar/Online-Chatting-App.git
```

🏗️ Build and Run the Application

Follow these steps to build and run the application:

1. Build & Run the Containers:

```bash
cd Online-Chatting-App
```
```bash
docker-compose up -d --build
```

2. Access the application in your browser:

```
http://localhost
```
---

### To Verify the conncetion between backend and databse:
```bash
docker-compose logs -f
```

### Once the backend and frontend containers are running, you can access the application in your browser:

`Frontend: http://localhost`


You can now interact with the real-time chat app and start messaging!

---


## 🔮 Future Plans

This project is evolving, and here are a few exciting things on the horizon:

* [ ] **CI/CD Pipelines:** Implement Continuous Integration and Continuous Deployment pipelines to automate testing and deployment.
* [ ] **Kubernetes (K8s):** Add Kubernetes manifests for container orchestration to deploy the app on cloud platforms like AWS, GCP, or Azure.
* [ ] **Feature Expansion:** Add more features like group chats, media sharing, and user status updates.


---

## 📚 Project Snapshots:

![Settings](frontend/public/settings.png)

![chat](frontend/public/chat.png)

![signup](/frontend/public/signup.png)

![Login](/frontend/public/login.png)













