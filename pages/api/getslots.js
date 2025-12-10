export default function handler(req, res) {
  // 1. Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 2. Safely extract the date from query parameters
    const { date } = req.query;

    // 3. CRITICAL FIX: Check if date exists before using it
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: "Date parameter is required (e.g., ?date=2024-01-01)" });
    }

    // Optional: Log for debugging
    console.log("Fetching slots for date:", date);

    // 4. Generate Mock Slots (Replace this with your real database logic later)
    // This example generates slots and randomly marks some as unavailable
    const timeSlots = [
      "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM",
      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];

    const slots = timeSlots.map((time) => ({
      time,
      // Simple logic: make random slots unavailable for demo purposes
      available: Math.random() > 0.3 
    }));

    // 5. Send success response
    return res.status(200).json({ 
      date,
      slots 
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}