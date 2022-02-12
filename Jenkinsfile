pipeline {
    agent { docker 'node:16.14.0' }
    stages {
        stage('echo info') {
            steps {
                sh 'npm --version'
                sh 'node --version'
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

