# Production Deployment - Quick Start Guide

## Environment Setup

### 1. Server Configuration
Copy `server/.env.example` to `server/.env` and fill in your values:
```bash
cd server
cp .env.example .env
# Edit .env with your actual credentials
```

### 2. Client Configuration  
Copy `client/.env.example` to `client/.env` and fill in your values:
```bash
cd client
cp .env.example .env
# Edit .env with your actual API URL and keys
```

## Critical Production Checklist

### ✅ Completed
- [x] Email credentials moved to environment variables
- [x] Created `.env.example` templates
- [x] Removed debug console.logs from user routes
- [x] Project structure reorganized
- [x] Error handling utilities created

### 🔄 Verify Before Deployment
- [ ] All environment variables set in production
- [ ] Database connection string updated for production
- [ ] CORS_ORIGIN set to production domain
- [ ] JWT_SECRET changed to strong random string
- [ ] Email credentials configured
- [ ] Razorpay keys configured
- [ ] Cloudinary credentials configured

### 📦 Build & Deploy
```bash
# Client build
cd client
npm run build

# Server start
cd server
npm start
```

### 🔍 Post-Deployment Checks
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test payment gateway
- [ ] Test email delivery
- [ ] Check error logs
- [ ] Monitor performance

## Important Notes
- Never commit `.env` files to Git
- Keep `.env.example` updated when adding new variables
- Use strong, unique passwords for production
- Enable HTTPS in production
- Set up monitoring and logging
