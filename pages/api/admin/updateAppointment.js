import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing appointment id" });
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db("appointmentsDB");
    const appointmentsCollection = db.collection("appointments");

    let result = null;
    try {
      result = await appointmentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    } catch (e) {
      // If invalid ObjectId, search by formId
      result = await appointmentsCollection.updateOne(
        { formId: id },
        { $set: updateData }
      );
    }

    await client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res
      .status(200)
      .json({
        message: "Appointment updated successfully",
        modifiedCount: result.modifiedCount,
      });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
