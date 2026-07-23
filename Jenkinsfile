pipeline {
    agent any

    environment {
        PORT = "5001"
        NODE_ENV = "production"
        JWT_SECRET = "99Q/2f1Msz+MplHc1WhsQ2/LEXKvIAk65AfxB6JNmx8="
        MONGODB_URI = "mongodb://root:admin@mongodb:27017/chatApp?authSource=admin&retryWrites=true&w=majority"
        COOKIE_SECURE= "false"
        CLIENT_ORIGIN= "http://localhost,http://3.252.58.87"
    }

    stages {
        stage("Cloning") {
            steps {
                git url: "https://github.com/DattaRahegaonkar/Online-Chatting-App.git", branch: "main"
            }

        }

        stage("Create .env") {
            steps {
                sh '''
                cat > backend/.env <<EOF
                PORT=$PORT
                NODE_ENV=$NODE_ENV
                JWT_SECRET=$JWT_SECRET
                MONGODB_URI=$MONGODB_URI
                COOKIE_SECURE=$COOKIE_SECURE
                CLIENT_ORIGIN=$CLIENT_ORIGIN
                EOF
                '''
            }
        }

        stage("test") {
            steps {
                echo "testing"
            }
        }
    }
}