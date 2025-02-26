import React, { useState, useContext } from "react"
import { UserContext } from "../context/UserContext"
import DailyJournal from "../components/DailyJournal"

// Determine the base URL for API calls
const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? "http://localhost:5000"
    : "https://call-journal.onrender.com";

function Home() {
    const [customerNumber, setCustomerNumber] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [callId, setCallId] = useState("")
    const [conversation, setConversation] = useState([])
    const { user } = useContext(UserContext);

    const handleCall = async () => {
        // Validate that the customer number starts with +91
        if (!customerNumber.startsWith("+91")) {
            alert("Please enter a valid phone number starting with +91.")
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/make-call`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customerNumber, customerName }),
            })

            const data = await response.json()
            if (data.success) {
                alert("Call initiated successfully!")
                setCallId(data.data.id)
            } else {
                alert(`Error: ${data.error}`)
            }
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }

    const fetchCallDetails = async () => {
        if (!callId) {
            alert("Please enter a call ID.")
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/call/${callId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-google-id": user.googleId,
                },
            })

            const data = await response.json()
            if (data.success) {
                const messages = data.data.messages.map((msg) => ({
                    role: msg.role,
                    message: msg.message,
                }))
                setConversation(messages)
            } else {
                alert(`Error: ${data.error}`)
            }
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Daily Journal</h1>
            <DailyJournal />
            {user && <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Hey {user.name}! Lets make a call for your daily journal</h1>}
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    placeholder="Enter customer number"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                    onClick={handleCall}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Make Call
                </button>
                {callId && (
                    <div className="text-gray-800 dark:text-white">
                        <strong>Call ID:</strong> {callId}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Enter call ID"
                    value={callId}
                    onChange={(e) => setCallId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                    onClick={fetchCallDetails}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Get Call Summary
                </button>
                <div className="space-y-2">
                    {conversation.map((msg, index) => (
                        <div key={index} className="text-gray-800 dark:text-white">
                            <strong>{msg.role}:</strong> {msg.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home

