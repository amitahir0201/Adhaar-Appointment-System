# Deployment Guide - Vercel

## Prerequisites

1. GitHub account with repository pushed
2. Vercel account (https://vercel.com)
3. MongoDB Atlas cluster (https://www.mongodb.com/cloud/atlas)

## Steps to Deploy on Vercel

### 1. Prepare MongoDB Atlas

- Create a MongoDB Atlas account and cluster
- Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/appointmentsDB?retryWrites=true&w=majority`
- Whitelist Vercel IPs (or allow all IPs with 0.0.0.0/0)

### 2. Connect Repository to Vercel

- Go to https://vercel.com/new
- Import your GitHub repository
- Select "Next.js" as the framework (Vercel auto-detects)

### 3. Set Environment Variables

In Vercel dashboard, add these environment variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/appointmentsDB?retryWrites=true&w=majority
DB_NAME=appointmentsDB
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=<generate-random-string-min-32-chars>
JWT_SECRET=your-jwt-secret
ADMIN_SECRET=admin1234
NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app
```

**To generate NEXTAUTH_SECRET**, run in your local terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy

- Click "Deploy" button
- Vercel will build and deploy automatically
- Your app will be live at `https://your-project-name.vercel.app`

### 5. Seed Database (After First Deployment)

The database is empty on first deployment. You have two options:

**Option A: Seed via API (Recommended)**
Create a `/pages/api/admin/seed.js` endpoint and call it manually, or

**Option B: Run seed script locally**
```bash
npm run build
node scripts/seedDatabase.js
```

## Important Notes

- **NEXTAUTH_URL**: Must match your Vercel deployment URL exactly
- **NEXTAUTH_SECRET**: Should be a random 32+ character string, never commit it
- **MongoDB URI**: Use MongoDB Atlas (cloud) for production, not localhost
- **Build**: Next.js 15 is configured and optimized for Vercel

## Troubleshooting

**Build fails**: Check that all environment variables are set in Vercel dashboard

**Auth not working**: Ensure NEXTAUTH_URL matches your deployment URL

**Database connection fails**: Verify MongoDB Atlas IP whitelist and connection string

**Appointments not showing**: Ensure database is seeded with test data

## Project Structure

```
├── pages/
│   ├── admin/          # Admin pages
│   ├── api/            # API routes
│   │   ├── auth/       # NextAuth
│   │   └── admin/      # Admin APIs
│   └── ...
├── models/             # Mongoose models
├── lib/                # Database utilities
├── scripts/            # Seed scripts
└── components/         # React components
```

## Supported Admins (After Seeding)

- **Super Admin**: superadmin@example.com / admin123
- **Delhi Admin**: delhi.admin@example.com / admin123
- **Mumbai Admin**: mumbai.admin@example.com / admin123
- **Bangalore Admin**: bangalore.admin@example.com / admin123
- **Chennai Admin**: chennai.admin@example.com / admin123

All admins use **Admin Secret ID**: admin1234
