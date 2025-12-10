// test-connection.js
const { MongoClient } = require('mongodb');

// I have updated this URL with the new "testuser" and "testpassword123"
const uri = "mongodb+srv://testuser:testpassword123@project.a6car0v.mongodb.net/appointmentsDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Attempting to connect with 'testuser'...");
    await client.connect();
    console.log("✅ SUCCESS! Connected to MongoDB Atlas correctly.");
    
    const db = client.db("appointmentsDB");
    const count = await db.collection("users").countDocuments();
    console.log(`Current user count: ${count}`);

  } catch (err) {
    console.log("❌ CONNECTION FAILED");
    // This will print the exact reason if it fails again
    console.error(err);
  } finally {
    await client.close();
  }
}

run();