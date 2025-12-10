import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Missing appointment id" });
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db("appointmentsDB");
    const appointmentsCollection = db.collection("appointments");

    // Try to find by ObjectId first, then by any field
    let appointment = null;
    try {
      appointment = await appointmentsCollection.findOne({
        _id: new ObjectId(id),
      });
    } catch (e) {
      // If invalid ObjectId, search by formId or other fields
      appointment = await appointmentsCollection.findOne({ formId: id });
    }

    await client.close();

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
