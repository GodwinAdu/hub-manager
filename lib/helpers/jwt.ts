import jwt from "jsonwebtoken"
import { nanoid } from "nanoid"
import mongoose from "mongoose"

// Types
interface User {
    _id: string | mongoose.Types.ObjectId
    email: string
    name?: string
    roles: string[]
}

interface RefreshTokenDoc {
    user: mongoose.Types.ObjectId
    token: string
    expiresAt: Date
    revoked: boolean
}



function addDays(date: Date, days: number) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}

export function signAccessToken(user: User) {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not set in environment variables");
    }
    const payload = { sub: (user._id as string).toString(), roles: user.roles, email: user.email, name: user.name }
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_TTL! } as jwt.SignOptions)
    return token
}

export async function issueRefreshToken(userId: string,) {
    const token = nanoid(64)
    const expiresAt = addDays(new Date(), Number(process.env.REFRESH_TOKEN_TTL_DAYS)!)

    // Note: This should be handled by backend API calls in a real frontend
    // For now, returning the token without database operations
    console.warn("issueRefreshToken should be called via API in frontend")

    return token
}

export function verifyAccessToken(token: string) {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not configured")
    }

    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        sub: string
        roles: string[]
        email: string
        name?: string
        iat: number
        exp: number
    }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string; isValid: boolean }> {
    try {
        // Note: This should be handled by backend API calls in a real frontend
        console.warn("verifyRefreshToken should be called via API in frontend")

        // For frontend, this would typically be an API call to the backend
        // Example: const response = await fetch('/api/auth/verify-refresh', { ... })

        return { userId: "", isValid: false }
    } catch (error) {
        console.error("Refresh token verification error:", error)
        return { userId: "", isValid: false }
    }
}

export async function revokeRefreshToken(token: string, revokedBy?: string, reason?: string): Promise<boolean> {
    try {
        // Note: This should be handled by backend API calls in a real frontend
        console.warn("revokeRefreshToken should be called via API in frontend")

        // For frontend, this would typically be an API call to the backend
        // Example: const response = await fetch('/api/auth/revoke-refresh', { ... })

        return false
    } catch (error) {
        console.error("Token revocation error:", error)
        return false
    }
}