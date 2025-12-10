import { connectToDatabase } from "@/lib/mongodb";
export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME);

    res.status(200).json({
      ok: true,
      dbName: db.databaseName,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
