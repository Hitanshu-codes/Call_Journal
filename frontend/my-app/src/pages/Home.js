import { useState } from "react"
import DailyJournal from "../components/DailyJournal"

function Home() {
    const [customerNumber, setCustomerNumber] = useState("")
    const [customerName, setCustomerName] = useState("")

    const handleCall = async () => {
        // Validate that the customer number starts with +91
        if (!customerNumber.startsWith("+91")) {
            alert("Please enter a valid phone number starting with +91.")
            return
        }

        try {
            const response = await fetch("http://localhost:5000/make-call", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customerNumber, customerName }),
            })

            const data = await response.json()
            if (data.success) {
                alert("Call initiated successfully!")
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
            </div>
        </div>
    )
}

export default Home

