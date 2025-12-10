# Adhaar Appointment System

A modern, full-stack web application for managing Aadhaar service appointments across multiple centers. Built with Next.js, MongoDB, and NextAuth for secure authentication and role-based access control.

##  Features

### User Features
-  Book appointments for Aadhaar services
-  View available time slots
-  Fill and submit appointment forms
-  Track appointment status
-  Secure user authentication

### Admin Features
-  Multi-center admin support (one admin per center)
-  View and manage appointments for assigned center
-  Update appointment details
-  Change appointment status (Pending/Confirmed/Completed)
-  Super admin to view all centers

### Centers Supported
- Delhi - Central Office
- Mumbai - Eastern Office
- Bangalore - South Office
- Chennai - South Office

##  Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth v4 with JWT
- **Security**: bcryptjs for password hashing
- **Deployment**: Vercel-ready

##  Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (for production)
- Vercel account (for deployment)

##  Quick Start

### 1. Clone the Repository
`ash
git clone https://github.com/01-Deep-Prajapati/adhaar-appointment-system.git
cd adhaar-appointment-system
`

### 2. Install Dependencies
`ash
npm install
`

### 3. Set Up Environment Variables
Copy .env.example to .env.local and update with your values:

`ash
MONGO_URI=mongodb://localhost:27017/appointmentsDB
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
JWT_SECRET=your-jwt-secret
ADMIN_SECRET=admin1234
NEXT_PUBLIC_API_URL=http://localhost:3000
`

### 4. Start Development Server
`ash
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Seed Database with Test Data
`ash
node scripts/seedDatabase.js
`

This creates:
- 1 Super Admin
- 4 Center-Specific Admins
- 4 Regular Users
- Sample appointments and slots

##  Test Credentials

### Admin Logins
| Email | Password | Center | Secret ID |
|-------|----------|--------|-----------|
| superadmin@example.com | admin123 | All Centers | admin1234 |
| delhi.admin@example.com | admin123 | Delhi | admin1234 |
| mumbai.admin@example.com | admin123 | Mumbai | admin1234 |
| bangalore.admin@example.com | admin123 | Bangalore | admin1234 |
| chennai.admin@example.com | admin123 | Chennai | admin1234 |

### User Logins
| Email | Password |
|-------|----------|
| john@example.com | password123 |
| jane@example.com | password123 |
| rajesh@example.com | password123 |
| priya@example.com | password123 |

##  Project Structure

`
 pages/
    admin/              # Admin dashboard and forms
    api/                # API routes
       auth/          # NextAuth endpoints
       admin/         # Admin-specific APIs
    ...                 # Public pages
 models/                 # Mongoose schemas (User)
 lib/                    # Database utilities
 components/             # React components
 scripts/                # Utility scripts (seeding)
 styles/                 # Global styles and Tailwind
 public/                 # Static assets
 DEPLOYMENT.md          # Deployment guide
`

##  Authentication & Authorization

- **Public Routes**: Home, About, FAQ, Contact
- **Protected Routes**: Appointment booking, User dashboard
- **Admin Routes**: Admin dashboard, appointment management
- **Role-Based Access**: Different permissions for Super Admin vs Center Admins

##  Database Schema

### User Model
`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin",
  center: String | null,  // Center name for admin
  createdAt: Date,
  updatedAt: Date
}
`

##  Building for Production

`ash
npm run build
npm start
`

##  Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Vercel deployment instructions.

### Quick Deploy:
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy!

##  API Endpoints

### Authentication
- POST /api/auth/[...nextauth] - NextAuth endpoints
- POST /api/auth/register - User registration

### Admin APIs
- GET /api/admin/appointments - Get appointments (filtered by center)
- PATCH /api/admin/appointments - Update appointment status
- GET /api/admin/getAppointmentById - Get single appointment
- POST /api/admin/updateAppointment - Update appointment details

### Public APIs
- POST /api/bookapp - Book new appointment
- GET /api/getslots - Get available slots
- POST /api/saveAppointment - Save appointment

##  Troubleshooting

### Build Fails
- Ensure all environment variables are set
- Check Node.js version (18+)
- Clear .next folder: Remove-Item -Recurse .next

### Authentication Issues
- Verify NEXTAUTH_SECRET is long enough (32+ chars)
- Check NEXTAUTH_URL matches your domain
- Ensure database connection is working

### Appointments Not Showing
- Verify database is seeded
- Check admin's center assignment
- Review browser console for errors

##  Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [MongoDB Docs](https://docs.mongodb.com)
- [Mongoose Docs](https://mongoosejs.com/docs)

##  Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

##  License

MIT License - feel free to use this for your projects!

##  Author

Created with  for efficient Aadhaar appointment management.

##  Support

For issues and questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review existing GitHub issues
3. Create a new issue with details

---

**Happy Coding! **
