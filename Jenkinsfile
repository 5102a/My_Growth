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
                sh 'ls -ll'
                sh 'echo "$AN_ACCESS_KEY" >> .env'
                sh 'ls -ll'
                sh 'cat .env'
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

