pipeline {
    agent { docker 'node:16.14.0' }
    environment { 
        envfile = credentials('envfile') 
    }
    stages {
        stage('pre-build') {
            steps {
                sh 'echo "$envfile" >> .env'
                sh 'chmod 755 ./build.sh'
            }
        }
        stage('build') {
            steps {
                sh './build.sh'
            }
        }
    }
}

