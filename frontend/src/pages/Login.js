import { useEffect, useState } from "react";
const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? "http://localhost:5000"
    : "https://call-journal.onrender.com";


function Login() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/auth/user`, { credentials: "include" })
            .then(res => res.json())
            .then(data => setUser(data));
    }, []);

    const login = () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    const logout = () => {
        window.location.href = `${API_BASE_URL}/auth/logout`;
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