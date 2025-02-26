import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const API_BASE_URL = process.env.NODE_ENV === 'development'
        ? "http://localhost:5000"
        : "https://call-journal.onrender.com";

    useEffect(() => {
        fetch(`${API_BASE_URL}/auth/user`, { credentials: "include" })
            .then(res => {
                console.log("Response status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("Fetched user data:", data);
                setUser(data);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
