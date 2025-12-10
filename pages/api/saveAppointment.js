// 1. Import the connection helper you already created
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  // 2. Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { 
      formId, 
      fullName, 
      phone, 
      email, 
      aadhaarNumber, 
      gender, 
      dob, 
      address, 
      idProof, 
      reason 
    } = req.body;

    // 3. Basic Validation (Optional but recommended)
    if (!fullName || !phone || !aadhaarNumber) {
        return res.status(400).json({ message: "Missing required fields (Name, Phone, or Aadhaar)" });
    }

    // 4. Connect to Database (Reusing your existing connection!)
    const { db } = await connectToDatabase();

    // 5. Store the Data
    // MongoDB will automatically create the 'appointments' collection if it doesn't exist
    const result = await db.collection("appointments").insertOne({
      formId,
      fullName,
      phone,
      email,
      aadhaarNumber,
      gender,
      dob,
      address,
      idProof,
      reason,
      createdAt: new Date(), // Automatically add the timestamp
    });

    // 6. Send Success Response
    res.status(200).json({ 
        message: "Appointment Saved Successfully", 
        success: true,
        appointmentId: result.insertedId 
    });

  } catch (error) {
    console.error("Appointment API Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}