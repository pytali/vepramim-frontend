import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ToastProps {
    message: string
    type?: 'success' | 'error'
    duration?: number
    onClose: () => void
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const bgColor = type === 'success'
        ? 'bg-green-500/90 dark:bg-green-600/90'
        : 'bg-red-500/90 dark:bg-red-600/90'

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 right-8 px-6 py-3 rounded-lg text-white shadow-lg ${bgColor} z-50`}
        >
            <div className="flex items-center gap-2">
                {type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {message}
            </div>
        </motion.div>
    )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {children}
        </AnimatePresence>
    )
} 