"use client"

import { useState, useEffect, useId } from "react"
import { useToast } from "./useToast"

function DailyJournal() {
    const [overallDay, setOverallDay] = useState("")
    const [positives, setPositives] = useState("")
    const [negatives, setNegatives] = useState("")
    const { toast } = useToast()

    const overallDayId = useId()
    const positivesId = useId()
    const negativesId = useId()

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]
        const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
        const todayEntry = entries.find((entry) => entry.date.startsWith(today))
        if (todayEntry) {
            setOverallDay(todayEntry.overallDay)
            setPositives(todayEntry.positives)
            setNegatives(todayEntry.negatives)
        }
    }, [])

    const handleSave = () => {
        const today = new Date().toISOString().split("T")[0]
        const entry = {
            date: today,
            overallDay,
            positives,
            negatives,
        }
        const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
        const index = entries.findIndex((e) => e.date.startsWith(today))
        if (index !== -1) {
            entries[index] = entry
        } else {
            entries.push(entry)
        }
        localStorage.setItem("journalEntries", JSON.stringify(entries))
        toast({
            title: "Journal entry saved!",
            description: "Your reflection for today has been updated.",
        })
    }

    const handleSummarize = () => {
        const summary = `
      Overall: ${overallDay.slice(0, 50)}...
      Positives: ${positives.split(".")[0]}.
      Negatives: ${negatives.split(".")[0]}.
    `
        toast({
            title: "Daily Summary",
            description: summary,
            duration: 5000,
        })
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Today's Reflection</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor={overallDayId} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Overall Day
                    </label>
                    <textarea
                        id={overallDayId}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="How did you feel today? Provide a quick summary."
                        value={overallDay}
                        onChange={(e) => setOverallDay(e.target.value)}
                        rows={3}
                    />
                </div>
                <div>
                    <label htmlFor={positivesId} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Positives & Wins
                    </label>
                    <textarea
                        id={positivesId}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="What went well today? Any small or big wins?"
                        value={positives}
                        onChange={(e) => setPositives(e.target.value)}
                        rows={3}
                    />
                </div>
                <div>
                    <label htmlFor={negativesId} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Negatives & Losses
                    </label>
                    <textarea
                        id={negativesId}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="What didn't go as planned? Any setbacks?"
                        value={negatives}
                        onChange={(e) => setNegatives(e.target.value)}
                        rows={3}
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Entry
                    </button>
                    <button
                        onClick={handleSummarize}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Summarize
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DailyJournal

