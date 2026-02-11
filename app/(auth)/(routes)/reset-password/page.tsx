"use client"

import { useAuth } from "@/providers/auth-provider"
import type React from "react"
import { useState } from "react"


interface ResetPasswordFormProps {
    token: string
    onSuccess?: () => void
    onError?: (error: string) => void
    className?: string
    redirectTo?: string
}

export function ResetPasswordForm({ token, onSuccess, onError, className = "", redirectTo }: ResetPasswordFormProps) {
    const { resetPassword } = useAuth()
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            onError?.("Passwords do not match")
            return
        }

        if (formData.password.length < 8) {
            onError?.("Password must be at least 8 characters long")
            return
        }

        setLoading(true)

        try {
            const result = await resetPassword(token, formData.password)
            if (result.success) {
                onSuccess?.()
                if (redirectTo) {
                    window.location.href = redirectTo
                }
            } else {
                onError?.(result.error || "Failed to reset password")
            }
        } catch (error) {
            onError?.("Network error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
                <p className="mt-2 text-sm text-gray-600">Enter your new password below.</p>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                </label>
                <div className="mt-1 relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter new password"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showPassword ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    )
}