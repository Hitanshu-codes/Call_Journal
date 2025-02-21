"use client"

import { useState, useEffect } from "react"

function History() {
    const [entries, setEntries] = useState([])

    useEffect(() => {
        const storedEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
        setEntries(storedEntries)
    }, [])

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Journal History</h1>
            {entries.map((entry, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        {new Date(entry.date).toLocaleDateString()}
                    </h2>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <strong>Overall Day:</strong> {entry.overallDay}
                    </p>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <strong>Positives & Wins:</strong> {entry.positives}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong>Negatives & Losses:</strong> {entry.negatives}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default History

