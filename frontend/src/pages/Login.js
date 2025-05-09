import { useEffect, useState } from "react";


function Login() {
    const [user, setUser] = useState(null);
    const API_BASE_URL = process.env.NODE_ENV === 'development'
        ? "http://localhost:5000"
        : "https://call-journal.onrender.com"; // Production URL
    console.log("API_BASE_URL: from login.js", API_BASE_URL);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/user`, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Fetch error:", error); // Log the error
            }
        };

        fetchUserData();
    }, [API_BASE_URL]);

    const login = () => {
        window.location.href = `${API_BASE_URL}/auth/google`; // Use production URL
    };

    const logout = () => {
        window.location.href = `${API_BASE_URL}/auth/logout`; // Use production URL
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            {user ? (
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome, {user.name}</h1>
                    <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
                </div>
            ) : (
                <button onClick={login} className="px-4 py-2 bg-blue-500 text-white rounded-md">Login with Google</button>
            )}
        </div>
    );
}

export default Login; 