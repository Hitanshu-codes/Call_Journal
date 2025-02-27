require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const connectDB = require("./database");
const User = require("./models/User");
const Call = require("./models/Call");
const authRouter = require("./auth"); // Import the auth router

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:3000', // Allow requests from this origin
        credentials: true // Allow cookies to be sent
    }));
} else {
    app.use(cors({
        origin: 'https://call-journal.vercel.app', // Allow requests from this origin
        credentials: true // Allow cookies to be sent
    }));
}

app.use(express.json()); // To parse JSON bodies
app.set("trust proxy", 1); // Fixes issues with cookies behind proxies

connectDB();

const VAPI_API_KEY = process.env.VAPI_API_KEY; // Store API key in .env

// Use the auth router
app.use(authRouter);

app.post("/users", async (req, res) => {
    const { googleId, name, email } = req.body;
    let user = await User.findOne({ googleId });

    if (!user) {
        user = new User({ googleId, name, email });
        await user.save();
    }
    res.json(user);
});

app.put("/users/:id/settings", async (req, res) => {
    const { phoneNumber, language, time } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { settings: { phoneNumber, language, time } }, { new: true });
    res.json(user);
});

app.post("/calls", async (req, res) => {
    const { userId, callId, duration, transcript, phoneNumber } = req.body;
    const call = new Call({ userId, callId, duration, transcript, phoneNumber });
    await call.save();
    res.json(call);
});

app.get("/users/:id/calls", async (req, res) => {
    const calls = await Call.find({ userId: req.params.id });
    res.json(calls);
});

app.get("/calls/:callId", async (req, res) => {
    const call = await Call.findOne({ callId: req.params.callId });
    res.json(call);
});

app.post("/make-call", async (req, res) => {
    const { customerNumber, customerName } = req.body;
    if (!customerNumber) {
        return res.status(400).json({ success: false, error: "Customer number is required" });
    }

    try {
        const response = await fetch("https://api.vapi.ai/call", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${VAPI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": "Journal",
                "assistantId": "9bce5847-6f88-4371-b7f7-68744d7f3a82",
                "phoneNumberId": "9a6235af-6552-46e9-bde5-c86a9be4cff9",
                "assistantOverrides": {
                    "variableValues": {
                        "name": customerName
                    }
                },
                "phoneNumber": {
                    "twilioAccountSid": process.env.TWILIO_SID,
                    "twilioAuthToken": process.env.TWILIO_AUTH_TOKEN,
                    "twilioPhoneNumber": process.env.TWILIO_PHONE_NUMBER
                },
                "customer": {
                    "name": "anyone",
                    "number": customerNumber
                }
            }),
        });

        const body = await response.json();
        res.json({ success: true, data: body });
        console.log("Call initiated successfully!");
        console.log(body);

    } catch (error) {
        console.error("Error making call:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/call/:id", async (req, res) => {
    const callId = req.params.id;
    const googleId = req.headers['x-google-id']; // Retrieve googleId from headers

    if (!googleId) {
        return res.status(400).json({ success: false, error: "Google ID is required" });
    }

    try {
        // Find the user by googleId
        const user = await User.findOne({ googleId });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const userId = user._id; // Extract userId (ObjectId)

        const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${VAPI_API_KEY}`,
            }
        });

        const body = await response.json();
        // console.log("Response body:", body);

        // Check if the call details were successfully retrieved
        if (body.status === "ended") {
            // Extract necessary details from the response
            const { id, transcript, customer, startedAt, endedAt } = body;
            const duration = new Date(endedAt) - new Date(startedAt); // Calculate duration in milliseconds

            // Save the call details to the database
            const call = new Call({
                userId: userId, // Use the retrieved userId (ObjectId)
                callId: id,
                duration: Math.floor(duration / 1000), // Convert to seconds
                transcript: transcript,
                phoneNumber: customer.number
            });
            await call.save();
            console.log("Call saved to database:", call);

            res.json({ success: true, data: body });
        } else {
            res.status(400).json({ success: false, error: "Failed to retrieve call details" });
        }

    } catch (error) {
        console.error("Error fetching call details:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
