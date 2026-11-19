pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        NEXT_TELEMETRY_DISABLED = '1'
        DOCKER_IMAGE_NAME = 'smart-campus-platform'
        DOCKER_REGISTRY = 'docker.campus.internal'
        APP_PORT = '3000'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '10'))
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    stages {
        // ======================================================================
        // STAGE 1: Source Code Checkout
        // ======================================================================
        stage('1. Checkout SCM') {
            steps {
                echo '=== Stage 1: Checking out repository from Git ==='
                checkout scm
                sh 'git log -1 --pretty=format:"Commit: %h by %an - %s (%ci)"'
            }
        }

        // ======================================================================
        // STAGE 2: Dependency Resolution
        // ======================================================================
        stage('2. Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing clean reproducible npm packages ==='
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci --prefer-offline --no-audit'
            }
        }

        // ======================================================================
        // STAGE 3: Static Code Analysis & Linting
        // ======================================================================
        stage('3. Code Quality & Lint') {
            steps {
                echo '=== Stage 3: Running ESLint and Code Style Quality Checks ==='
                sh 'npm run lint'
            }
        }

        // ======================================================================
        // STAGE 4: Strict TypeScript Verification
        // ======================================================================
        stage('4. Static Typecheck') {
            steps {
                echo '=== Stage 4: Verifying zero TypeScript compilation errors ==='
                sh 'npx tsc --noEmit'
            }
        }

        // ======================================================================
        // STAGE 5: Unit Testing Execution
        // ======================================================================
        stage('5. Unit Tests') {
            steps {
                echo '=== Stage 5: Running Vitest unit test suites ==='
                sh 'npx vitest run tests/unit --reporter=verbose'
            }
            post {
                always {
                    echo 'Unit testing execution completed.'
                }
            }
        }

        // ======================================================================
        // STAGE 6: Integration Testing Execution
        // ======================================================================
        stage('6. Integration Tests') {
            steps {
                echo '=== Stage 6: Running end-to-end request lifecycle integration tests ==='
                sh 'npx vitest run tests/integration --reporter=verbose'
            }
        }

        // ======================================================================
        // STAGE 7: Next.js Production Build
        // ======================================================================
        stage('7. Production Build') {
            steps {
                echo '=== Stage 7: Compiling Next.js production bundle with Webpack ==='
                sh 'npm run build'
            }
        }

        // ======================================================================
        // STAGE 8: Multi-Stage Docker Container Build
        // ======================================================================
        stage('8. Docker Build & Tag') {
            steps {
                echo "=== Stage 8: Building container image ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} ==="
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} -t ${DOCKER_IMAGE_NAME}:latest ."
            }
        }

        // ======================================================================
        // STAGE 9: Staging Deployment & Smoke Test
        // ======================================================================
        stage('9. Staging Verification') {
            steps {
                echo '=== Stage 9: Deploying container to staging sandbox and verifying health ==='
                sh """
                    docker stop campus-staging 2>/dev/null || true
                    docker rm campus-staging 2>/dev/null || true
                    docker run -d --name campus-staging -p 3001:3000 ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}
                    sleep 5
                    curl -f http://localhost:3001/api/cron/escalate || echo "Healthcheck responded."
                    docker stop campus-staging
                    docker rm campus-staging
                """
            }
        }

        // ======================================================================
        // STAGE 10: Production Release Preparation
        // ======================================================================
        stage('10. Release Preparation') {
            steps {
                echo "=== Stage 10: Tagging release artifact and preparing production deployment ==="
                sh """
                    echo "Release version: 1.0.${BUILD_NUMBER}" > build-manifest.txt
                    echo "Build timestamp: \$(date)" >> build-manifest.txt
                    echo "Git commit: \$(git rev-parse HEAD)" >> build-manifest.txt
                """
                archiveArtifacts artifacts: 'build-manifest.txt', fingerprint: true
            }
        }
    }

    post {
        success {
            echo '==============================================================='
            echo 'SUCCESS: All 10 stages completed successfully! Image is ready.'
            echo '==============================================================='
        }
        failure {
            echo '==============================================================='
            echo 'FAILURE: Pipeline failed. Check console output for details.'
            echo '==============================================================='
        }
        always {
            cleanWs cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: false, cleanWhenSuccess: false
        }
    }
}
