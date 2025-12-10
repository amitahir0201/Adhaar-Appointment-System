import { connectToDatabase } from "../../lib/mongodb";
import bcrypt from "bcryptjs"; 

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, aadhaarNumber, password } = req.body;

    // 2. Validate Input
    if (!email || !email.includes('@') || !password || password.trim().length < 6) {
      return res.status(422).json({ message: 'Invalid input. Password must be at least 6 characters.' });
    }

    // 3. Connect to Database
    const { db } = await connectToDatabase();

    // 4. Check if user already exists
    // We check against the 'users' collection
    const existingUser = await db.collection('users').findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({ message: 'User already exists with this email!' });
    }

    // 5. Hash the password
    // NEVER store plain text passwords. We salt and hash it here.
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Store the new user
    const result = await db.collection('users').insertOne({
      name,
      email,
      phone,
      aadhaarNumber,
      password: hashedPassword, // Storing the HASH, not the real password
      createdAt: new Date(),
    });

    // 7. Success Response
    res.status(201).json({ message: 'User created successfully!', userId: result.insertedId });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}