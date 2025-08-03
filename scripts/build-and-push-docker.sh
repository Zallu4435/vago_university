#!/bin/bash

# Docker Build and Push Script
# This script builds and pushes Docker images to Docker Hub

set -e

# Configuration
DOCKER_REGISTRY="docker.io"
DOCKER_NAMESPACE="zallu"
BACKEND_APP="university-management-platform-backend"
FRONTEND_APP="university-management-platform-frontend"

# Get current git commit and build number
GIT_COMMIT_SHORT=$(git rev-parse --short HEAD)
BUILD_NUMBER=${BUILD_NUMBER:-$(date +%s)}
IMAGE_TAG="${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
LATEST_TAG="latest"

echo "🚀 Building and pushing Docker images..."
echo "📋 Configuration:"
echo "   Registry: ${DOCKER_REGISTRY}"
echo "   Namespace: ${DOCKER_NAMESPACE}"
echo "   Image Tag: ${IMAGE_TAG}"
echo "   Latest Tag: ${LATEST_TAG}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and push Backend
echo "🔨 Building Backend image..."
cd backend
if [ -f Dockerfile ]; then
    BACKEND_IMAGE="${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${BACKEND_APP}"
    
    echo "   Building: ${BACKEND_IMAGE}:${IMAGE_TAG}"
    docker build -t "${BACKEND_IMAGE}:${IMAGE_TAG}" .
    docker tag "${BACKEND_IMAGE}:${IMAGE_TAG}" "${BACKEND_IMAGE}:${LATEST_TAG}"
    
    echo "   Pushing to Docker Hub..."
    docker push "${BACKEND_IMAGE}:${IMAGE_TAG}"
    docker push "${BACKEND_IMAGE}:${LATEST_TAG}"
    
    echo "✅ Backend image pushed successfully!"
else
    echo "⚠️  No Dockerfile found in backend directory"
fi
cd ..

# Build and push Frontend
echo "🔨 Building Frontend image..."
cd frontend
if [ -f Dockerfile ]; then
    FRONTEND_IMAGE="${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${FRONTEND_APP}"
    
    echo "   Building: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
    docker build -t "${FRONTEND_IMAGE}:${IMAGE_TAG}" .
    docker tag "${FRONTEND_IMAGE}:${IMAGE_TAG}" "${FRONTEND_IMAGE}:${LATEST_TAG}"
    
    echo "   Pushing to Docker Hub..."
    docker push "${FRONTEND_IMAGE}:${IMAGE_TAG}"
    docker push "${FRONTEND_IMAGE}:${LATEST_TAG}"
    
    echo "✅ Frontend image pushed successfully!"
else
    echo "⚠️  No Dockerfile found in frontend directory"
fi
cd ..

echo ""
echo "🎉 Docker build and push completed!"
echo "📋 Images:"
echo "   Backend: ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${BACKEND_APP}:${IMAGE_TAG}"
echo "   Frontend: ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${FRONTEND_APP}:${IMAGE_TAG}"
echo ""
echo "💡 Next steps:"
echo "   1. Push to GitHub to trigger Jenkins pipeline"
echo "   2. Jenkins will update Helm charts with new image tags"
echo "   3. ArgoCD will deploy the updated images" 