import { connectToDatabase } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { date, city, center } = req.query;

    if (!date || !city || !center) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const { db } = await connectToDatabase();
    const appointments = await db
      .collection("appointments")
      .find({ date, city, center })
      .toArray();

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
