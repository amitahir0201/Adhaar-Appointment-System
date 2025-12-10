import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGO_URI; // Add this in .env.local
const DB_NAME = "aadhaar_system"; // Change based on your database name

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}
