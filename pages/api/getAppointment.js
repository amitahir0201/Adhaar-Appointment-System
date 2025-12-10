import mongoose from "mongoose";

// Reuse the schema definition logic
const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", new mongoose.Schema({}, { strict: false }));

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { formId } = req.query;

  if (!formId) return res.status(400).json({ message: "Form ID missing" });

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const data = await Appointment.findOne({ formId });
    
    if (!data) return res.status(404).json({ message: "Not found" });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}