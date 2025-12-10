import { MongoClient } from "mongodb";

export async function POST(req) {
    try {
        const { date, city, center, slots } = await req.json();

        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("appointmentDB");
        const collection = db.collection("appointments");

        // Insert selected slots into the database
        await collection.insertMany(slots);

        await client.close();

        return new Response(JSON.stringify({ message: "Slots saved successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error saving slots:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
