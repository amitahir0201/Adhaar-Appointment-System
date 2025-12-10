// models/user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // This will store the HASH, not plain text
    role: { type: String, enum: ["user", "admin"], default: "user" },
    center: {
      type: String,
      enum: [
        "Delhi - Central Office",
        "Mumbai - Eastern Office",
        "Bangalore - South Office",
        "Chennai - South Office",
      ],
      default: null,
    }, // Center assigned to admin
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

export default mongoose.models.User || mongoose.model("User", UserSchema);
