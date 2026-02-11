"use client"

import { useAuth } from "@/providers/auth-provider"
import type React from "react"
import { useState } from "react"


interface ForgotPasswordFormProps {
    onSuccess?: () => void
    onError?: (error: string) => void
    className?: string
}

export function ForgotPasswordForm({ onSuccess, onError, className = "" }: ForgotPasswordFormProps) {
    const { forgotPassword } = useAuth()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await forgotPassword(email)
            if (result.success) {
                setSent(true)
                onSuccess?.()
            } else {
                onError?.(result.error || "Failed to send reset email")
            }
        } catch (error) {
            onError?.("Network error")
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className={`text-center space-y-4 ${className}`}>
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-600">
                    We've sent a password reset link to <strong>{email}</strong>. Click the link to reset your password.
                </p>
                <button onClick={() => setSent(false)} className="text-sm text-blue-600 hover:text-blue-500">
                    Send another email
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Forgot Password</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </button>
        </form>
    )
}