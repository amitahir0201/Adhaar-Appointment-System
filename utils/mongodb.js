import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGO_URI; // Load from .env.local
const MONGODB_DB = process.env.DB_NAME || "aadhaar_services"; // Your database name

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI in .env.local");
    }

    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}
