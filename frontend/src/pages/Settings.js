"use client"

import { useState, useEffect, useId, useContext } from "react"
import { useToast } from "../components/useToast"
import { UserContext } from "../context/UserContext"

function Settings() {
    const [callTime, setCallTime] = useState("20:00")
    const [language, setLanguage] = useState("en")
    const [phoneNumber, setPhoneNumber] = useState("+911023456789")
    const { toast } = useToast()
    const { user } = useContext(UserContext)

    const callTimeId = useId()
    // const voiceTypeId = useId()

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/${user._id}`); // Replace `userId` dynamically
                if (!response.ok) throw new Error("Failed to fetch settings");

                const userData = await response.json();
                if (userData.settings) {
                    setPhoneNumber(userData.settings.phoneNumber);
                    setLanguage(userData.settings.language);
                    setCallTime(userData.settings.time);
                } else {
                    console.error("User settings are undefined");
                    setPhoneNumber("+911023456789");
                    setLanguage("en");
                    setCallTime("20:00");
                }
                console.log("user settings from settings page:", userData)
            } catch (error) {
                console.error("Error fetching user settings:", error);
            }
        };

        fetchUserSettings();
    }, [user._id]);

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/users/${user._id}/settings`, { // Replace `userId` with actual user ID
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber,
                    language,
                    time: callTime,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update settings");
            }

            const updatedUser = await response.json();
            console.log("Updated user settings:", updatedUser);

            toast({
                title: "Settings saved!",
                description: "Your preferences have been updated.",
            });
        } catch (error) {
            console.error("Error updating settings:", error);
            toast({
                title: "Error",
                description: "Failed to update settings. Try again.",
                status: "error",
            });
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Voice and Call Configuration</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="phoneno" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Phone Number
                        </label>
                        <input
                            id="phoneno"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
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
                        <label htmlFor="language" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Language
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="en">Default</option>
                            <option value="hi">Hindi</option>

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

