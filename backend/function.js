import Vapi from "@vapi-ai/web";

const vapi = new Vapi({
    apiKey: "0fb49a01-c8dc-45f4-a6e8-26ceea1bf53e",
});
const assistantOverrides = {
    variableValues: {
        name: "Hitanshu",
    },
};
vapi.start("9bce5847-6f88-4371-b7f7-68744d7f3a82", assistantOverrides);
vapi.on("speech-start", () => {
    console.log("Assistant speech has started.");
});
vapi.on("speech-end", () => {
    console.log("Assistant speech has ended.");
});
vapi.on("call-start", () => {
    console.log("Call has started.");
});
vapi.on("call-end", () => {
    console.log("Call has ended.");
});
// Various assistant messages can come back (like function calls, transcripts, etc)
vapi.on("message", (message) => {
    console.log(message);
});

vapi.on("error", (e) => {
    console.error(e);
});

vapi.say("Our time's up, goodbye!", true)

vapi.stop();
