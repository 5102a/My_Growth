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
                sh 'ls -f'
                sh 'echo "$AN_ACCESS_KEY" >> .env'
                sh 'ls -f'
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

