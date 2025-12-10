import { connectToDatabase } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { date, city, center, slots } = req.body;

    if (!date || !city || !center || !slots || slots.length === 0) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const { db } = await connectToDatabase();

    // Insert each slot as a separate entry in the database
    const newAppointments = slots.map(({ time, slot }) => ({
      date,
      city,
      center,
      time,
      slot,
    }));

    await db.collection("appointments").insertMany(newAppointments);

    return res.status(201).json({ message: "Booking confirmed!" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
