pipeline {
    agent { docker 'node:16.14.0' }
    environment { 
        AN_ACCESS_KEY = credentials('envfile') 
    }
    stages {
        stage('pre-build') {
            steps {
                sh 'echo "$AN_ACCESS_KEY" >> .env'
                sh 'chmod 755 ./pre-build.sh'
                sh 'chmod 755 ./build.sh'
                sh './pre-build.sh'
            }
        }
        stage('build') {
            steps {
                sh 'npm i gulp -g'
                sh './build.sh'
            }
        }
    }
}

