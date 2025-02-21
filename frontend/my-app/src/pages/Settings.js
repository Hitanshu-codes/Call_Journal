"use client"

import { useState, useEffect, useId } from "react"
import { useToast } from "../components/useToast"

function Settings() {
    const [callTime, setCallTime] = useState("20:00")
    const [voiceType, setVoiceType] = useState("default")
    const { toast } = useToast()

    const callTimeId = useId()
    const voiceTypeId = useId()

    useEffect(() => {
        const savedCallTime = localStorage.getItem("callTime") || "20:00"
        const savedVoiceType = localStorage.getItem("voiceType") || "default"
        setCallTime(savedCallTime)
        setVoiceType(savedVoiceType)
    }, [])

    const handleSave = () => {
        localStorage.setItem("callTime", callTime)
        localStorage.setItem("voiceType", voiceType)
        toast({
            title: "Settings saved!",
            description: "Your preferences have been updated.",
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Voice and Call Configuration</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor={callTimeId} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Daily Call Time
                        </label>
                        <input
                            id={callTimeId}
                            type="time"
                            value={callTime}
                            onChange={(e) => setCallTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor={voiceTypeId} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Voice Type
                        </label>
                        <select
                            id={voiceTypeId}
                            value={voiceType}
                            onChange={(e) => setVoiceType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="default">Default</option>
                            <option value="friendly">Friendly</option>
                            <option value="professional">Professional</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings

