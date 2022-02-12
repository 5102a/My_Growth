pipeline {
    agent { docker 'node:16.14.0' }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'node --version'
                sh 'ls -ll'
                sh './build.sh'
            }
        }
    }
}

