
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 40, unit: 'MINUTES')
    }

    environment {
        IMAGE_NAME = 'smart-campus-platform'
    }

    stages {

        stage('Verify Build Environment') {
            steps {
                bat '''
                    echo Checking Node.js...
                    node --version
                    npm --version

                    echo Checking Docker...
                    docker version
                '''
            }
        }

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('ESLint Validation') {
            steps {
                bat 'npm run lint'
            }
        }

        stage('TypeScript Validation') {
            steps {
                bat 'npx tsc --noEmit'
            }
        }

        stage('Unit Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Production Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '''
                    docker build -t %IMAGE_NAME%:%BUILD_NUMBER% .
                    docker tag %IMAGE_NAME%:%BUILD_NUMBER% %IMAGE_NAME%:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'SMART CAMPUS CI PIPELINE COMPLETED SUCCESSFULLY'
        }

        failure {
            echo 'PIPELINE FAILED. CHECK THE FAILED STAGE AND CONSOLE OUTPUT.'
        }

        always {
            echo 'Smart Campus pipeline execution finished.'
        }
    }
}
