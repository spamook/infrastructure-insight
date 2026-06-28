pipeline {
    agent any

    environment {
        REGISTRY   = '192.168.56.15:5000'
        APP_SERVER = '192.168.56.13'
        WEB1       = '192.168.56.11'
        WEB2       = '192.168.56.12'
        SSH_KEY    = '/var/lib/jenkins/.ssh/id_ed25519'
    }

    stages {

        stage('Build') {
            steps {
                sh 'docker build -t $REGISTRY/backend:latest ./backend'
                sh 'docker build -t $REGISTRY/frontend:latest ./frontend'
            }
        }

        stage('Push') {
            steps {
                sh 'docker push $REGISTRY/backend:latest'
                sh 'docker push $REGISTRY/frontend:latest'
            }
        }

        stage('Deploy backend') {
            steps {
                sh '''
                    ssh -i $SSH_KEY devops@$APP_SERVER \
                    "docker pull $REGISTRY/backend:latest && \
                     docker-compose -f /vagrant/docker-compose.backend.yml up -d"
                '''
            }
        }

        stage('Deploy frontend') {
            steps {
                sh '''
                    ssh -i $SSH_KEY devops@$WEB1 \
                    "docker pull $REGISTRY/frontend:latest && \
                     docker-compose -f /vagrant/docker-compose.frontend.yml up -d"

                    ssh -i $SSH_KEY devops@$WEB2 \
                    "docker pull $REGISTRY/frontend:latest && \
                     docker-compose -f /vagrant/docker-compose.frontend.yml up -d"
                '''
            }
        }
    }

    post {
        success { echo 'Deployment complete' }
        failure { echo 'Deployment failed'  }
    }
}