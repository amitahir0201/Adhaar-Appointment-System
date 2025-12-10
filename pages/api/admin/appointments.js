import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get session to check user's center
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const client = new MongoClient(MONGO_URI);
      await client.connect();
      const db = client.db("appointmentsDB");
      const appointmentsCollection = db.collection("appointments");

      // Filter by center if user is center-specific admin (not super admin)
      const filter = session.user.center ? { center: session.user.center } : {};

      // Fetch appointments
      const appointments = await appointmentsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      await client.close();
      return res.status(200).json({ appointments });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else if (req.method === "PATCH") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ message: "Missing id or status" });
      }

      const client = new MongoClient(MONGO_URI);
      await client.connect();
      const db = client.db("appointmentsDB");
      const appointmentsCollection = db.collection("appointments");

      // Update appointment status
      const result = await appointmentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );

      await client.close();

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      return res
        .status(200)
        .json({ message: "Appointment updated successfully" });
    } catch (error) {
      console.error("Error updating appointment:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
