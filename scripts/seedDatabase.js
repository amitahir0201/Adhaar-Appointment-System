import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

// Import models
import User from "../models/user.js";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGO_URI;

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    console.log(`Connecting to ${MONGO_URI}`);

    // Connect to MongoDB using Mongoose
    await mongoose.connect(MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // ========== SEED USERS ==========
    console.log("\n📝 Creating users...");

    // Delete existing users
    await User.deleteMany({});
    console.log("✓ Cleared existing users");

    // Seed dummy users with hashed passwords
    const dummyUsers = [
      {
        name: "Super Admin",
        email: "superadmin@example.com",
        password: await bcryptjs.hash("admin123", 10),
        role: "admin",
        center: null, // Super admin can see all centers
      },
      {
        name: "Delhi Admin",
        email: "delhi.admin@example.com",
        password: await bcryptjs.hash("admin123", 10),
        role: "admin",
        center: "Delhi - Central Office",
      },
      {
        name: "Mumbai Admin",
        email: "mumbai.admin@example.com",
        password: await bcryptjs.hash("admin123", 10),
        role: "admin",
        center: "Mumbai - Eastern Office",
      },
      {
        name: "Bangalore Admin",
        email: "bangalore.admin@example.com",
        password: await bcryptjs.hash("admin123", 10),
        role: "admin",
        center: "Bangalore - South Office",
      },
      {
        name: "Chennai Admin",
        email: "chennai.admin@example.com",
        password: await bcryptjs.hash("admin123", 10),
        role: "admin",
        center: "Chennai - South Office",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: await bcryptjs.hash("password123", 10),
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await bcryptjs.hash("password123", 10),
        role: "user",
      },
      {
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        password: await bcryptjs.hash("password123", 10),
        role: "user",
      },
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        password: await bcryptjs.hash("password123", 10),
        role: "user",
      },
    ];

    const createdUsers = await User.insertMany(dummyUsers);
    console.log(`✓ Created ${createdUsers.length} users`);
    console.log("\n  🔐 Admin Credentials (by Center):");
    console.log(
      "  - superadmin@example.com / admin123 (Super Admin - All Centers)"
    );
    console.log("  - delhi.admin@example.com / admin123 (Delhi Center)");
    console.log("  - mumbai.admin@example.com / admin123 (Mumbai Center)");
    console.log(
      "  - bangalore.admin@example.com / admin123 (Bangalore Center)"
    );
    console.log("  - chennai.admin@example.com / admin123 (Chennai Center)");
    console.log("\n  👤 User Credentials:");
    console.log("  - john@example.com / password123 (User)");
    console.log("  - jane@example.com / password123 (User)");
    console.log("  - rajesh@example.com / password123 (User)");
    console.log("  - priya@example.com / password123 (User)");

    // ========== SEED APPOINTMENTS (Optional) ==========
    console.log("\n📅 Creating appointments collection...");
    const appointmentsCollection =
      mongoose.connection.collection("appointments");

    // Drop existing appointments collection
    try {
      await appointmentsCollection.drop();
      console.log("✓ Dropped existing appointments collection");
    } catch (e) {
      console.log("✓ Appointments collection didn't exist, creating new one");
    }

    // Seed dummy appointments
    const dummyAppointments = [
      {
        center: "Delhi - Central Office",
        service: "Aadhaar Update",
        fullName: "John Doe",
        phone: "9876543210",
        email: "john@example.com",
        aadhaarNumber: "1234 5678 9012",
        gender: "Male",
        dob: "1990-05-15",
        address: "123 Main Street, Delhi",
        idProof: "Driving License",
        reason: "Address Update",
        appointmentDate: "2025-12-15",
        appointmentSlot: "10:00 AM - 11:00 AM",
        status: "Confirmed",
        createdAt: new Date(),
      },
      {
        center: "Mumbai - Eastern Office",
        service: "Aadhaar Enrollment",
        fullName: "Jane Smith",
        phone: "8765432109",
        email: "jane@example.com",
        aadhaarNumber: "9876 5432 1098",
        gender: "Female",
        dob: "1992-08-22",
        address: "456 Oak Avenue, Mumbai",
        idProof: "Passport",
        reason: "New Enrollment",
        appointmentDate: "2025-12-16",
        appointmentSlot: "02:00 PM - 03:00 PM",
        status: "Confirmed",
        createdAt: new Date(),
      },
      {
        center: "Bangalore - South Office",
        service: "Aadhaar Update",
        fullName: "Rajesh Kumar",
        phone: "7654321098",
        email: "rajesh@example.com",
        aadhaarNumber: "5555 5555 5555",
        gender: "Male",
        dob: "1988-03-10",
        address: "789 Pine Road, Bangalore",
        idProof: "PAN Card",
        reason: "Phone Number Update",
        appointmentDate: "2025-12-17",
        appointmentSlot: "11:00 AM - 12:00 PM",
        status: "Pending",
        createdAt: new Date(),
      },
      {
        center: "Chennai - South Office",
        service: "Aadhaar Verification",
        fullName: "Priya Sharma",
        phone: "6543210987",
        email: "priya@example.com",
        aadhaarNumber: "6666 6666 6666",
        gender: "Female",
        dob: "1995-12-25",
        address: "321 Elm Street, Chennai",
        idProof: "Voter ID",
        reason: "Document Verification",
        appointmentDate: "2025-12-18",
        appointmentSlot: "03:00 PM - 04:00 PM",
        status: "Completed",
        createdAt: new Date(),
      },
    ];

    const appointmentsResult = await appointmentsCollection.insertMany(
      dummyAppointments
    );
    console.log(`✓ Created ${appointmentsResult.insertedCount} appointments`);

    // ========== SEED SLOTS ==========
    console.log("\n🕐 Creating slots collection...");
    const slotsCollection = mongoose.connection.collection("slots");

    // Drop existing slots collection
    try {
      await slotsCollection.drop();
      console.log("✓ Dropped existing slots collection");
    } catch (e) {
      console.log("✓ Slots collection didn't exist, creating new one");
    }

    // Seed dummy slots
    const centers = [
      "Delhi - Central Office",
      "Mumbai - Eastern Office",
      "Bangalore - South Office",
      "Chennai - South Office",
    ];
    const dates = ["2025-12-15", "2025-12-16", "2025-12-17", "2025-12-18"];
    const timeSlots = [
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM",
    ];

    const slots = [];
    centers.forEach((center) => {
      dates.forEach((date) => {
        timeSlots.forEach((slot) => {
          slots.push({
            center,
            date,
            slot,
            available: Math.random() > 0.3, // 70% availability
            capacity: 5,
            booked: Math.floor(Math.random() * 3),
          });
        });
      });
    });

    const slotsResult = await slotsCollection.insertMany(slots);
    console.log(`✓ Created ${slotsResult.insertedCount} appointment slots`);

    // ========== CREATE INDEXES ==========
    console.log("\n🔍 Creating indexes...");
    await appointmentsCollection.createIndex({ email: 1 });
    await appointmentsCollection.createIndex({ aadhaarNumber: 1 });
    await slotsCollection.createIndex({ center: 1, date: 1 });
    console.log("✓ Indexes created successfully");

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Appointments: ${dummyAppointments.length}`);
    console.log(`   - Slots: ${slots.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
