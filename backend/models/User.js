const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    settings: {
        phoneNumber: { type: String, default: "+911023456789" },
        language: { type: String, default: "en" },
        time: { type: String, default: "12:00 PM" }
    }
}, { timestamps: true, _id: false });

module.exports = mongoose.model("User", UserSchema);
