import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return handler(req, res);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI3, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return res.status(500).json({ success: false, error: "Database connection failed" });
  }

  return handler(req, res);
};

export default connectDB;
