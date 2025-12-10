import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // 1. Check Method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 2. Connect to Database
    await connectToDatabase();

    const { email, password, adminId } = req.body;

    // 3. Validate Input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 4. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 5. Check Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 6. Admin Verification Logic
    // If the user saved in DB is an admin, we check the adminId provided in the login form
    if (user.role === "admin") {
      // Ensure the secret exists in .env
      if (!process.env.ADMIN_SECRET) {
          console.error("ADMIN_SECRET is missing in .env.local");
          return res.status(500).json({ message: "Server configuration error" });
      }

      // Check if the provided adminId matches the Environment Variable
      if (adminId !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Invalid Admin ID" });
      }
    }

    // 7. Generate Token
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing in .env.local");
        return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    // 8. Success Response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}