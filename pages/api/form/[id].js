import { connectToDatabase } from "@/utils/db"; // Database connection utility
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { id } = req.query;
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Form ID" });
    }

    switch (req.method) {
        // 📌 GET: Fetch form details
        case "GET":
            try {
                const form = await db.collection("forms").findOne({ _id: new ObjectId(id) });

                if (!form) return res.status(404).json({ error: "Form not found" });

                res.status(200).json(form);
            } catch (error) {
                res.status(500).json({ error: "Error fetching form" });
            }
            break;

        // 📌 PUT: Update form details
        case "PUT":
            try {
                const { name, slot } = req.body;
                
                if (!name || !slot) {
                    return res.status(400).json({ error: "Name and Slot are required" });
                }

                const updatedForm = await db.collection("forms").updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { name, slot, updatedAt: new Date() } }
                );

                if (updatedForm.matchedCount === 0) {
                    return res.status(404).json({ error: "Form not found" });
                }

                res.status(200).json({ message: "Form updated successfully" });
            } catch (error) {
                res.status(500).json({ error: "Error updating form" });
            }
            break;

        // 📌 DELETE: Remove form
        case "DELETE":
            try {
                const deletedForm = await db.collection("forms").deleteOne({ _id: new ObjectId(id) });

                if (deletedForm.deletedCount === 0) {
                    return res.status(404).json({ error: "Form not found" });
                }

                res.status(200).json({ message: "Form deleted successfully" });
            } catch (error) {
                res.status(500).json({ error: "Error deleting form" });
            }
            break;

       
        default:
            res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
            res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
