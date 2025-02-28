const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    callId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number, required: true }, // in seconds
    transcript: { type: String, default: "" },
    phoneNumber: { type: String, required: true },
    gratitude: { type: String, default: "" },
    negatives: { type: String, default: "" },
    positives: { type: String, default: "" },
    overallDay: { type: String, default: "" },
    keyLearnings: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Call", CallSchema);
