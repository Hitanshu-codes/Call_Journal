"use client"

import { useState, useCallback } from "react"

export function useToast() {
    const [toasts, setToasts] = useState([])

    const toast = useCallback(({ title, description, duration = 3000 }) => {
        const id = Date.now()
        setToasts((prevToasts) => [...prevToasts, { id, title, description, duration }])
        return id
    }, [])

    const dismiss = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, [])

    return { toast, dismiss, toasts }
}

