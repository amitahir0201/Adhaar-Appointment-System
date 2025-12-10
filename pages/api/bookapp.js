import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI; // Store MongoDB URI in .env.local
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await client.connect();
    const db = client.db("aadhaarAppointments"); // Database Name
    const appointmentsCollection = db.collection("appointments"); // Collection Name

    const {
      center,
      service,
      fullName,
      phone,
      email,
      aadhaarNumber,
      gender,
      dob,
      address,
      idProof,
      reason,
      appointmentDate,
      appointmentSlot,
    } = req.body;

    // 🚨 Check if all required fields are filled
    if (
      !center ||
      !service ||
      !fullName ||
      !phone ||
      !email ||
      !aadhaarNumber ||
      !gender ||
      !dob ||
      !address ||
      !idProof ||
      !reason ||
      !appointmentDate ||
      !appointmentSlot
    ) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // 🚨 Check if the slot is already booked
    const existingAppointment = await appointmentsCollection.findOne({
      appointmentDate,
      appointmentSlot,
      center,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This slot is already booked. Please select another." });
    }

    // 📝 Insert new appointment
    const newAppointment = {
      center,
      service,
      fullName,
      phone,
      email,
      aadhaarNumber,
      gender,
      dob,
      address,
      idProof,
      reason,
      appointmentDate,
      appointmentSlot,
      createdAt: new Date(),
    };

    await appointmentsCollection.insertOne(newAppointment);

    return res.status(201).json({
      message: "Appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  } finally {
    await client.close();
  }
}
