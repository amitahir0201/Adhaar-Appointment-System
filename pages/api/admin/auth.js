import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_ID = process.env.ADMIN_ID; 

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, role, adminId } = req.body;
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("test");
    const usersCollection = db.collection("users");

    try {
      if (req.url.includes("signup")) {
        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check for Admin role validation
        if (role === "Admin" && adminId !== ADMIN_ID) {
          return res.status(403).json({ message: "Invalid Admin ID" });
        }

        // Insert new user
        await usersCollection.insertOne({
          name,
          email,
          password: hashedPassword,
          role,
        });

        return res.status(201).json({ message: "User registered successfully" });
      }
      
      if (req.url.includes("login")) {
        // Find user by email
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
          expiresIn: "1h",
        });

        return res.status(200).json({ message: "Login successful", token, role: user.role });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      await client.close();
    }
  }
  res.status(405).json({ message: "Method Not Allowed" });
}
