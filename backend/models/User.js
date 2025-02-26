const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    settings: {
        phoneNumber: { type: String, default: "" },
        language: { type: String, default: "en" },
        time: { type: String, default: "12:00 PM" }
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
