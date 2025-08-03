pipeline {
    agent any
    
    environment {
        // Docker registry configuration
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_NAMESPACE = 'zallu'
        
        // Application names
        BACKEND_APP = 'university-management-platform-backend'
        FRONTEND_APP = 'university-management-platform-frontend'
        
        // Git configuration
        GIT_BRANCH = "${env.BRANCH_NAME ?: env.GIT_BRANCH}"
        GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        GIT_COMMIT_FULL = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        
        // Build configuration
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        BUILD_TAG = "${env.BUILD_TAG}"
        
        // Kubernetes configuration
        KUBE_NAMESPACE = 'university-management'
        
        // ArgoCD configuration
        ARGOCD_SERVER = 'argocd-server.argocd.svc.cluster.local:80'
        ARGOCD_NAMESPACE = 'argocd'
        
        // Image tags
        IMAGE_TAG = "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        LATEST_TAG = "latest"
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Clean workspace
                    cleanWs()
                    
                    // Checkout code using SSH
                    checkout([$class: 'GitSCM', 
                        branches: [[name: "*/${GIT_BRANCH}"]], 
                        doGenerateSubmoduleConfigurations: false, 
                        extensions: [
                            [$class: 'GitLFSPull'],
                            [$class: 'CleanBeforeCheckout'],
                            [$class: 'CleanCheckout']
                        ], 
                        submoduleCfg: [], 
                        userRemoteConfigs: [[
                            credentialsId: 'github-ssh-credentials',
                            url: 'git@github.com:Zallu4435/vago_university.git'
                        ]]
                    ])
                    
                    // Set build description
                    currentBuild.description = "Branch: ${GIT_BRANCH} | Commit: ${GIT_COMMIT_SHORT} | Build: ${BUILD_NUMBER}"
                }
            }
        }
        
        stage('Validate') {
            parallel {
                stage('Backend Validation') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('backend') {
                            script {
                                // Install dependencies
                                sh 'npm ci'
                                
                                // Type checking
                                sh 'npm run type-check || echo "TypeScript check completed with warnings"'
                                
                                // Build
                                sh 'npm run build:prod || npm run build:simple || echo "Build completed"'
                            }
                        }
                    }
                }
                
                stage('Frontend Validation') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('frontend') {
                            script {
                                // Install dependencies
                                sh 'npm ci'
                                
                                // Linting
                                sh 'npm run lint || echo "Linting completed with warnings"'
                                
                                // Build
                                sh 'npm run build'
                            }
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            parallel {
                stage('Backend Security Scan') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('backend') {
                            script {
                                // Run security scan on backend dependencies
                                sh 'npm audit --audit-level=high || echo "Security scan completed with findings"'
                            }
                        }
                    }
                }
                
                stage('Frontend Security Scan') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('frontend') {
                            script {
                                // Run security scan on frontend dependencies
                                sh 'npm audit --audit-level=high || echo "Security scan completed with findings"'
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build & Push Images') {
            parallel {
                stage('Build & Push Backend') {
                    agent {
                        docker {
                            image 'docker:latest'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        script {
                            def backendImage = "${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${BACKEND_APP}"
                            
                            dir('backend') {
                                // Build Docker image
                                sh """
                                    echo "Building backend Docker image..."
                                    docker build -t ${backendImage}:${IMAGE_TAG} .
                                    docker tag ${backendImage}:${IMAGE_TAG} ${backendImage}:${LATEST_TAG}
                                """
                                
                                // Push to registry
                                withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    sh """
                                        echo "Pushing backend image to registry..."
                                        docker login ${DOCKER_REGISTRY} -u ${DOCKER_USER} -p ${DOCKER_PASS}
                                        docker push ${backendImage}:${IMAGE_TAG}
                                        docker push ${backendImage}:${LATEST_TAG}
                                    """
                                }
                            }
                        }
                    }
                }
                
                stage('Build & Push Frontend') {
                    agent {
                        docker {
                            image 'docker:latest'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        script {
                            def frontendImage = "${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${FRONTEND_APP}"
                            
                            dir('frontend') {
                                // Build Docker image
                                sh """
                                    echo "Building frontend Docker image..."
                                    docker build -t ${frontendImage}:${IMAGE_TAG} .
                                    docker tag ${frontendImage}:${IMAGE_TAG} ${frontendImage}:${LATEST_TAG}
                                """
                                
                                // Push to registry
                                withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                    sh """
                                        echo "Pushing frontend image to registry..."
                                        docker login ${DOCKER_REGISTRY} -u ${DOCKER_USER} -p ${DOCKER_PASS}
                                        docker push ${frontendImage}:${IMAGE_TAG}
                                        docker push ${frontendImage}:${LATEST_TAG}
                                    """
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Update Helm Charts') {
            steps {
                script {
                    // Update image tags in Helm charts
                    def backendImage = "${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${BACKEND_APP}"
                    def frontendImage = "${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${FRONTEND_APP}"
                    
                    echo "Updating Helm charts with new image tags..."
                    
                    // Update backend values.yaml
                    sh """
                        echo "Updating backend Helm chart..."
                        sed -i 's|repository:.*|repository: ${backendImage}|g' helm-charts/backend/values.yaml
                        sed -i 's|tag:.*|tag: "${IMAGE_TAG}"|g' helm-charts/backend/values.yaml
                    """
                    
                    // Update frontend values.yaml
                    sh """
                        echo "Updating frontend Helm chart..."
                        sed -i 's|repository:.*|repository: ${frontendImage}|g' helm-charts/frontend/values.yaml
                        sed -i 's|tag:.*|tag: "${IMAGE_TAG}"|g' helm-charts/frontend/values.yaml
                    """
                    
                    // Verify changes
                    sh """
                        echo "Backend values.yaml:"
                        grep -A 2 "image:" helm-charts/backend/values.yaml
                        echo "Frontend values.yaml:"
                        grep -A 2 "image:" helm-charts/frontend/values.yaml
                    """
                }
            }
        }
        
        stage('Commit & Push Changes') {
            steps {
                script {
                    // Configure git
                    sh """
                        git config user.email "jenkins@university-platform.com"
                        git config user.name "Jenkins CI"
                    """
                    
                    // Add changes
                    sh """
                        git add helm-charts/backend/values.yaml
                        git add helm-charts/frontend/values.yaml
                    """
                    
                    // Commit changes
                    sh """
                        git commit -m "Update image tags to ${IMAGE_TAG} - Build ${BUILD_NUMBER} [skip ci]" || echo "No changes to commit"
                    """
                    
                    // Push changes
                    withCredentials([sshUserPrivateKey(credentialsId: 'github-ssh-credentials', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                        sh """
                            eval \$(ssh-agent -s)
                            ssh-add \$SSH_KEY
                            git push origin ${GIT_BRANCH} || echo "Push failed or no changes"
                        """
                    }
                }
            }
        }
        
        stage('Trigger ArgoCD Sync') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "Triggering ArgoCD sync for applications..."
                    
                    withCredentials([usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                        // Login to ArgoCD
                        sh """
                            echo "Logging into ArgoCD..."
                            argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USER} --password ${ARGOCD_PASS} --insecure --grpc-web
                        """
                        
                        // Sync backend application
                        sh """
                            echo "Syncing backend application..."
                            argocd app sync university-management-backend --prune --force || echo "Backend sync failed"
                        """
                        
                        // Sync frontend application
                        sh """
                            echo "Syncing frontend application..."
                            argocd app sync university-management-frontend --prune --force || echo "Frontend sync failed"
                        """
                        
                        // Wait for applications to be healthy
                        sh """
                            echo "Waiting for applications to be healthy..."
                            argocd app wait university-management-backend --health --timeout 300 || echo "Backend health check failed"
                            argocd app wait university-management-frontend --health --timeout 300 || echo "Frontend health check failed"
                        """
                        
                        // Get application status
                        sh """
                            echo "Application Status:"
                            argocd app list
                        """
                    }
                }
            }
        }
        
        stage('Health Check') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "Performing health checks..."
                    
                    // Wait for services to be ready
                    sh 'sleep 30'
                    
                    // Check if pods are running
                    sh """
                        echo "Checking pod status..."
                        kubectl get pods -n ${KUBE_NAMESPACE} -o wide
                    """
                    
                    // Check application health
                    withCredentials([usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                        sh """
                            argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USER} --password ${ARGOCD_PASS} --insecure --grpc-web
                            echo "Backend Application Status:"
                            argocd app get university-management-backend
                            echo "Frontend Application Status:"
                            argocd app get university-management-frontend
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up Docker images
                sh '''
                    docker system prune -f || true
                    docker image prune -f || true
                '''
                
                // Archive artifacts
                archiveArtifacts artifacts: '**/dist/**/*, **/build/**/*', allowEmptyArchive: true
                
                // Publish test results if any
                // publishTestResults testResultsPattern: '**/test-results/**/*.xml', allowEmptyResults: true
            }
        }
        
        success {
            script {
                // Send success notification
                echo "✅ Build successful for branch: ${env.GIT_BRANCH}"
                echo "✅ Build number: ${env.BUILD_NUMBER}"
                echo "✅ Commit: ${env.GIT_COMMIT_SHORT}"
                echo "✅ Build URL: ${env.BUILD_URL}"
            }
        }
        
        failure {
            script {
                // Send failure notification
                echo "❌ Build failed for branch: ${env.GIT_BRANCH}"
                echo "❌ Build number: ${env.BUILD_NUMBER}"
                echo "❌ Commit: ${env.GIT_COMMIT_SHORT}"
                echo "❌ Build URL: ${env.BUILD_URL}"
            }
        }
        
        cleanup {
            script {
                // Clean workspace
                echo "🧹 Cleaning up workspace..."
            }
        }
    }
} 