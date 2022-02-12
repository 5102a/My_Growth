pipeline {
    agent { docker 'node:16.14.0' }
    environment { 
        AN_ACCESS_KEY = credentials('envfile') 
    }
    stages {
        stage('echo info') {
            steps {
                sh 'npm --version'
                sh 'node --version'
                sh 'echo "$AN_ACCESS_KEY" >> .env'
            }
        }
        stage('build') {
            steps {
                sh 'chmod 777 ./build.sh'
                sh './build.sh'
            }
        }
    }
}

