"use client"

import { useEffect } from "react"
import { useToast } from "./useToast"

function Toaster() {
    const { toasts, dismiss } = useToast()

    useEffect(() => {
        toasts.forEach((toast) => {
            const timer = setTimeout(() => {
                dismiss(toast.id)
            }, toast.duration)

            return () => clearTimeout(timer)
        })
    }, [toasts, dismiss])

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts && toasts.map((toast) => (
                <div key={toast.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm">
                    {toast.title && <h3 className="font-bold text-gray-800 dark:text-white">{toast.title}</h3>}
                    {toast.description && <p className="text-gray-600 dark:text-gray-300">{toast.description}</p>}
                </div>
            ))}
        </div>
    )
}

export default Toaster

