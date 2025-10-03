#!/bin/bash

# Memora MVP Deployment Script
# Run this script to deploy your MVP to production

set -e  # Exit on any error

echo "🚀 Memora MVP Deployment Script"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_step "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed!"
}

# Setup environment files
setup_environment() {
    print_step "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        print_warning "backend/.env not found. Creating template..."
        cat > backend/.env << EOF
# Database
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Firebase Admin
FIREBASE_PROJECT_ID="memora-8b99d"
FIREBASE_PRIVATE_KEY=""-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyCjLslFK7+KNF\nHQ6mbIz7vQU4igp+L89F5+siCy2gI+62n/IwgPiygQAtRGroIeWy+Rh6p2O5QT23\nSC/FfmkuT1Bh4kk5tCjWF3CvM76CflFSgmixCIrCy+ztziKlWFS9zy+kGPT8Zpkk\nEaiJ2RFJAIhPrpp6nD/CGWDG9maCQsRp0Ri0edxqX3cYBlVj7BQRmwKo7sg39Gja\nJiceqeOvttbKF9fjQbQ791SWB6D3D+G/lEuo5KP56cRwFBTv8kee1jej86WmmHQX\nrrG9z8FJS3WXILdf45uXhMSO2kn2l6/MRsIZecSpIMB1NgvSmJOz4jlwwf+kOLqT\ntbh1FKljAgMBAAECggEAS0ul6sj1znpibnXR/s9Utphjr1wuANzuX4WsOxsYIixg\nJgsx7ZJ122RUM1DGl8LSNqVDVYgaVDxDwhI85dzG1eeEOsltJ4LKbHTAWtBa5yxN\n70OozAotSSHeY1o069GWESog31kQrvgjFw6CxT2wojuf6ncQ7P7MtiVueOa3RqoK\ncG7lRXd8i0cleA+V3RAMSz7DqUY3583g5hihAX9WhV5wuhBuHkBefli+KaBeBjdy\nMRndey3steYxMZk8qJKY6glpAR1jismlKRYJPcidkC1ZNNXULnCLgEXufATtryIp\nXmR0UDWhREOa/FBkIJBvfrhMF9Oj5CLRQ6FdFAjegQKBgQDaT4BrdDG4pBubExl9\ndNsN2RCuNfbmMWC/szRihMXG+DHu+E5cnIZR2QfbXGahtkRLQbWh/2vBSzmXqSYw\nV0K4RzAm/lF35EP8nrnPaYXBqHDAgzgKuMj4W84ykx2mRjS9hDrXuHtgLnP2oVtJ\nEnu8BGcY6F+SQFXxhv2rUz0h4wKBgQDQxuJt82xsvBpyJTcMmli+/xgb7m1rMxM1\nZvA5fH49SXthx/n/oJQ0uqRSWbTgglGBxPm5fPVXj6QY9S5Z6ys7AidfuCmkgUM3\n3mEgdGx5iCzwmsFJJsM05t0jk6hXMVnPxhoDUfilzx6kk/e40S9+rX4Q48pFFa8m\nexCTTirygQKBgQCPX8EmUPRKoDSlHuERvMoUiSdkUnqpaWpx296eiTZe2yfoGtlU\nB1RLsq5vSXr533twtWH1V4tMMfxL90HmY5ik79PW+BVHGPnxkcjUSCgZLGeId2U5\n3WvXeGuuWWISjm8avBntDPKyEzADnKsYDXSH4ZhYClyh73DCI/a7KvquIwKBgHQU\n0RsfSL7gi7fBt2z7eLKhtW76T75WBK0hkhn0fWBoNgD1JqyaRS1YRTtAg5B9BQKp\nWcxnjSZlSHFUCbSXTE8f8HKJPCYqdQxgShK4iQO90nbpJOUed1U3s+cvF197ohsj\nY51K+3x9v+T0HL2XGdhOcJTFgtaMqvkzXdD5mmmBAoGBAIqcbjjoC7yvezV8JAbh\nct6tQdZFv/40Sn0/NrKn1xOlJwe+Okhom9k3XnCV/2ugxa3EwUvmlaUwDoYbprwH\nvcjTLU8ES1v6EAUgVloorOmUgy3TGAY3rErTeKwdkBNpRmH743KSZvurULs5a4Pc\nsIzU/+HVWeHI9PLy3dlDlU13\n-----END PRIVATE KEY-----\n""
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@memora-8b99d.iam.gserviceaccount.com"

# Server
PORT=3001
NODE_ENV=production
EOF
        print_warning "Please update backend/.env with your actual values before deploying!"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        print_warning "frontend/.env not found. Creating template..."
        cat > frontend/.env << EOF
# Firebase Config
VITE_FIREBASE_API_KEY="AIzaSyAcFlW7wye1QdeGIv9LfLha-ICN-tCp_38"
VITE_FIREBASE_AUTH_DOMAIN="memora-8b99d.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="memora-8b99d"
VITE_FIREBASE_STORAGE_BUCKET="memora-8b99d.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="476071555871"
VITE_FIREBASE_APP_ID="1:476071555871:web:b7405a0f90b46674edb62a"

# API
VITE_API_BASE_URL="https://your-backend-url.railway.app/api"
EOF
        print_warning "Please update frontend/.env with your actual values before deploying!"
    fi
    
    print_success "Environment files ready!"
}

# Build and test locally
build_and_test() {
    print_step "Building and testing locally..."
    
    # Install backend dependencies
    print_step "Installing backend dependencies..."
    cd backend
    npm install
    
    # Build backend (TypeScript compilation)
    print_step "Building backend..."
    npm run build
    
    # Install frontend dependencies
    print_step "Installing frontend dependencies..."
    cd ../frontend
    npm install
    
    # Build frontend
    print_step "Building frontend..."
    npm run build
    
    cd ..
    print_success "Local build completed successfully!"
}

# Deploy backend to Railway
deploy_backend() {
    print_step "Deploying backend to Railway..."
    
    cd backend
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    # Check if already logged in
    if ! railway whoami &> /dev/null; then
        print_warning "Please login to Railway:"
        railway login
    fi
    
    # Deploy
    print_step "Deploying to Railway..."
    railway up
    
    print_success "Backend deployed to Railway!"
    print_warning "Don't forget to run 'railway run npx prisma db push' to setup your database!"
    
    cd ..
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_step "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy
    print_step "Deploying to Vercel..."
    vercel --prod
    
    print_success "Frontend deployed to Vercel!"
    
    cd ..
}

# Setup database
setup_database() {
    print_step "Setting up database..."
    
    cd backend
    
    # Push database schema
    print_step "Pushing database schema..."
    npx prisma db push
    
    print_success "Database schema deployed!"
    
    cd ..
}

# Main deployment flow
main() {
    echo "Starting deployment process..."
    echo ""
    
    check_dependencies
    setup_environment
    
    echo ""
    read -p "Have you updated the environment files with your actual values? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Please update your environment files first!"
        exit 1
    fi
    
    build_and_test
    
    echo ""
    read -p "Deploy backend to Railway? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_backend
    fi
    
    echo ""
    read -p "Setup database schema? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_database
    fi
    
    echo ""
    read -p "Deploy frontend to Vercel? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_frontend
    fi
    
    echo ""
    print_success "🎉 Deployment completed!"
    echo ""
    echo "Next steps:"
    echo "1. Update your Firebase Authentication authorized domains"
    echo "2. Test your live application"
    echo "3. Share with beta users"
    echo ""
    echo "Happy launching! 🚀"
}

# Run main function
main