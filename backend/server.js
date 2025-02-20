// require("dotenv").config();
// const express = require("express");
// const twilio = require("twilio");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// app.post("/make-call", async (req, res) => {
//     const { to } = req.body; // Phone number to call

//     try {
//         const call = await twilioClient.calls.create({
//             url: "https://api.vapi.ai/twilio?assistantId=9bce5847-6f88-4371-b7f7-68744d7f3a82",
//             to,
//             from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
//         });

//         res.json({ success: true, callSid: call.sid });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
