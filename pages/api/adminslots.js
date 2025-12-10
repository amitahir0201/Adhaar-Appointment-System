import { connectToDatabase } from "@/utils/mongodb";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const { db } = await connectToDatabase();
        const { date, slot } = req.query;

        let query = { date };
        if (slot) query.slot = slot;

        const appointments = await db.collection("appointments").find(query).toArray();
        res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
}
