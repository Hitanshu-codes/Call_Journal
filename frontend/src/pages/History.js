"use client"

import { useState, useEffect } from "react"

function History() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To manage error state
    const API_BASE_URL = process.env.NODE_ENV === 'development'
        ? "http://localhost:5000"
        : "https://call-journal.onrender.com";

    useEffect(() => {
        const fetchUserAndCalls = async () => {
            try {
                // Fetch the current user
                const userResponse = await fetch(`${API_BASE_URL}/auth/user`, {
                    method: "GET",
                    credentials: "include" // Include cookies for session management
                });

                if (!userResponse.ok) {
                    throw new Error("User not authenticated");
                }

                const user = await userResponse.json();
                const userId = user._id; // Get userId from user data
                const googleId = user.googleId; // Get googleId from user data

                // Fetch calls for the user
                const callsResponse = await fetch(`${API_BASE_URL}/users/${userId}/calls`, {
                    method: "GET",
                    credentials: "include" // Include cookies for session management
                });

                if (!callsResponse.ok) {
                    throw new Error("Failed to fetch calls");
                }

                const data = await callsResponse.json();
                setEntries(data); // Set the fetched calls to state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCalls();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>; // Show loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error state
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Call History</h1>
            {entries.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300 text-left text-xl">No calls found.</p> // Message when no calls are available
            ) : (
                entries.map((entry, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                            Call ID: {entry.callId}
                        </h2>
                        <p className="mb-2 text-gray-700 dark:text-gray-300">
                            <strong>Duration:</strong> {entry.duration} seconds
                        </p>
                        <p className="mb-2 text-gray-700 dark:text-gray-300">
                            <strong>Transcript:</strong> {entry.transcript}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Phone Number:</strong> {entry.phoneNumber}
                        </p>

                        {/* Display structured data in a table */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-white">Highlights</h3>
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-white">Aspect</th>
                                        <th className="border border-gray-300 px-4 py-2 text-white">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-white"><strong>Gratitude:</strong></td>
                                        <td className="border border-gray-300 px-4 py-2 text-white">{entry.gratitude || 'No gratitude mentioned'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-white"><strong>Negatives:</strong></td>
                                        <td className="border border-gray-300 px-4 py-2 text-white">{entry.negatives || 'No negatives mentioned'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-white"><strong>Positives:</strong></td>
                                        <td className="border border-gray-300 px-4 py-2 text-white">{entry.positives || 'No positives mentioned'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-white"><strong>Overall Day:</strong></td>
                                        <td className="border border-gray-300 px-4 py-2 text-white">{entry.overallDay || 'No overall day information'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-white"><strong>Key Learnings:</strong></td>
                                        <td className="border border-gray-300 px-4 py-2 text-white">{entry.keyLearnings || 'No key learnings mentioned'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default History;

