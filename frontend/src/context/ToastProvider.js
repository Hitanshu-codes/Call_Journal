import React, { createContext, useState } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        setToasts((prev) => [...prev, toast]);
    };

    const dismiss = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    // Create a toast function to be used in components
    const toast = ({ title, description, duration = 3000 }) => {
        const id = new Date().getTime(); // Simple ID generation
        addToast({ id, title, description, duration });
    };

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
};