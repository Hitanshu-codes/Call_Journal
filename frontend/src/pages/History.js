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
        return <div>Loading...</div>; // Show loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error state
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Call History</h1>
            {entries.length === 0 ? (
                <p>No calls found.</p> // Message when no calls are available
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
                    </div>
                ))
            )}
        </div>
    );
}

export default History;

