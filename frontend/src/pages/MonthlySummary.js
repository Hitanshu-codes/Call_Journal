"use client"

import { useState, useEffect } from "react"

function MonthlySummary() {
    const [summary, setSummary] = useState({})

    useEffect(() => {
        const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
        const monthlySummary = entries.reduce((acc, entry) => {
            const date = new Date(entry.date)
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
            if (!acc[monthYear]) {
                acc[monthYear] = []
            }
            acc[monthYear].push(entry)
            return acc
        }, {})
        setSummary(monthlySummary)
    }, [])

    function getMostCommonThemes(entries, field) {
        const allThemes = entries.flatMap((entry) => entry[field].split(". "))
        const themeCounts = allThemes.reduce((acc, theme) => {
            acc[theme] = (acc[theme] || 0) + 1
            return acc
        }, {})
        const sortedThemes = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])
        return sortedThemes
            .slice(0, 3)
            .map(([theme]) => theme)
            .join(", ")
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Monthly Summary</h1>
            {Object.entries(summary).map(([monthYear, entries]) => (
                <div key={monthYear} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{monthYear}</h2>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">Total entries: {entries.length}</p>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">Most common themes:</p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                        <li>Positives: {getMostCommonThemes(entries, "positives")}</li>
                        <li>Negatives: {getMostCommonThemes(entries, "negatives")}</li>
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default MonthlySummary

