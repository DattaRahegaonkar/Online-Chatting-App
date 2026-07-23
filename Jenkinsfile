pipeline {
    agent any

    stages {
        stage("Cloning") {
            steps {
                git url: "https://github.com/DattaRahegaonkar/Online-Chatting-App.git", branch: "main"
            }

        }

        stage("test") {
            steps {
                echo "testing"
            }
        }
    }
}