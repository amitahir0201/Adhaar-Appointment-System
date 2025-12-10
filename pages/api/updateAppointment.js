import mongoose from "mongoose";

// Define Schema
const AppointmentSchema = new mongoose.Schema({
  formId: String,
  fullName: String,
  date: String,
  slot: String,
  center: String,
  // Add strict: false to allow flexibility during development
}, { strict: false });

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);

export default async function handler(req, res) {
  // Debug log to see what the server is actually receiving
  console.log("Update API called with method:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { formId, date, slot, center } = req.body;

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const updated = await Appointment.findOneAndUpdate(
      { formId: formId },
      { $set: { date, slot, center } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Form ID not found" });
    }

    res.status(200).json({ message: "Success", data: updated });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
}