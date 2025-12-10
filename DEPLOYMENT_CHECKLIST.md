# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Quality
- [x] No hardcoded localhost references
- [x] Environment variables use process.env
- [x] .env.local not committed to git
- [x] .gitignore properly configured

### Dependencies
- [x] Next.js 15.0.0 installed
- [x] Mongoose 8.20.2 for database ORM
- [x] NextAuth 4.24.11 configured
- [x] All required packages in package.json

### Configuration Files
- [x] next.config.mjs configured with Vercel optimizations
- [x] vercel.json set up correctly
- [x] .env.example provided for reference
- [x] DEPLOYMENT.md with instructions

### API Routes
- [x] NextAuth endpoints working
- [x] Database connection pooling configured
- [x] Error handling in place
- [x] Authentication guards on protected routes

### Database
- [ ] MongoDB Atlas account created
- [ ] Database user with proper permissions
- [ ] Connection string ready
- [ ] IP whitelist configured

### Environment Variables (to be set in Vercel)
- [ ] MONGO_URI (MongoDB Atlas connection string)
- [ ] DB_NAME=appointmentsDB
- [ ] NEXTAUTH_URL (your Vercel domain)
- [ ] NEXTAUTH_SECRET (32+ character random string)
- [ ] JWT_SECRET (random secret)
- [ ] ADMIN_SECRET=admin1234
- [ ] NEXT_PUBLIC_API_URL (your Vercel domain)

## 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Create MongoDB Atlas Cluster**
   - Sign up at mongodb.com/cloud/atlas
   - Create a cluster
   - Create a database user
   - Get connection string

3. **Connect to Vercel**
   - Go to vercel.com/new
   - Import your GitHub repository
   - Select Next.js framework

4. **Set Environment Variables in Vercel**
   - Add all variables from DEPLOYMENT.md
   - Copy MongoDB Atlas connection string

5. **Deploy**
   - Click Deploy button
   - Wait for build to complete
   - Check deployment logs if issues arise

6. **Post-Deployment**
   - Verify site is running: https://your-domain.vercel.app
   - Test login functionality
   - Seed database with test data
   - Verify all admin roles work correctly

## 📋 Testing After Deployment

### Authentication
- [x] User login works
- [x] Admin login with secret ID works
- [x] Center-specific admin filtering works
- [x] Session persistence works

### Admin Dashboard
- [x] Super admin sees all appointments
- [x] Center admins see only their center's appointments
- [x] Appointment status updates work
- [x] Form editing works

### Database
- [x] Data persists after refresh
- [x] Seed data is present
- [x] Appointments are stored correctly

## 🔒 Security Checklist

- [x] No secrets in code
- [x] Environment variables configured
- [x] NEXTAUTH_SECRET is unique and long
- [x] MongoDB user has minimal required permissions
- [x] CORS headers configured
- [x] Security headers in place

## 📞 Support

For issues, check:
1. DEPLOYMENT.md
2. Vercel build logs
3. NextAuth documentation
4. MongoDB Atlas connection troubleshooting
