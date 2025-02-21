require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const VAPI_API_KEY = process.env.VAPI_API_KEY; // Store API key in .env

app.post("/make-call", async (req, res) => {
    const { customerNumber } = req.body; // Take customer number from request
    const { customerName } = req.body;
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

    try {
        const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${VAPI_API_KEY}`,
            }
        });

        const body = await response.json();
        res.json({ success: true, data: body });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
