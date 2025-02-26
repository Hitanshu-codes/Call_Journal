const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    callId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number, required: true }, // in seconds
    transcript: { type: String, default: "" },
    phoneNumber: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Call", CallSchema);
