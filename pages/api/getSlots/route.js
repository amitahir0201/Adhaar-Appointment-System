// import clientPromise from '@/lib/mongodb';
import clientPromise from '../../../lib/mongodb';
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const { city, center, date } = req.query;
  const { db } = await connectToDatabase();
  const slots = await db.collection("appointments").find({ city, center, date }).toArray();

  res.status(200).json(slots);
}
