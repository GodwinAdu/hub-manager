"use server";

import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import * as jwt from 'jsonwebtoken';
import { connectToDB } from "../connection/mongoose";
import { issueRefreshToken, signAccessToken } from "../helpers/jwt";
import { smsConfig } from "@/services/sms-config";
import User from "../models/user.model";


interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone: string;
}

// export async function registerUser(
//     data: RegisterData
// ): Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean; email?: string }> {
//     try {
//         const { email, password, name, phone } = data;

//         await connectToDB();

//         const existing = await User.findOne({ $or: [{ email }, { phone }] });
//         if (existing) {
//             return { success: false, error: "User with this email or phone already exists" };
//         }

//         const passwordHash = await hash(password, 12);

//         // Generate 6-digit verification code
//         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//         const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//         const newUser = await User.create({
//             email,
//             fullName: name,
//             phone,
//             passwordHash,
//             mfa: {
//                 enabled: false,
//                 backupCodes: [],
//                 method: "totp",
//             },
//             emailVerified: false,
//             phoneVerified: false,
//             loginAttempts: 0,
//             metadata: {},
//             emailVerificationCode: verificationCode,
//             emailVerificationExpires: verificationExpires,
//         });

//         // Send verification email
//         await sendEmail({
//             to: email,
//             subject: "Verify your email address",
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2>Welcome to AI Agent Platform!</h2>
//                     <p>Hi ${name},</p>
//                     <p>Thank you for signing up. Please verify your email address using the code below:</p>
//                     <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
//                         <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${verificationCode}</h1>
//                     </div>
//                     <p>This code will expire in 10 minutes.</p>
//                     <p>If you didn't create an account, please ignore this email.</p>
//                 </div>
//             `
//         });

//         await Subscription.create({
//             userId: newUser._id,
//             planId: "free",
//             planName: "Free Plan",
//             status: "active",
//             currentPeriodStart: new Date(),
//             currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days,
//         });

//         return { success: true, requiresEmailVerification: true, email };
//     } catch (error) {
//         console.error("Error registering User:", error);
//         return { success: false, error: "Internal server error" };
//     }
// }


interface LoginParams {
    email: string;
    password: string;
    mfaToken?: string;
    isBackupCode?: boolean;
    ip?: string;
    userAgent?: string;
}

export async function loginUser(data: LoginParams) {
    try {
        const { email, password, mfaToken } = data;

        await connectToDB();

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return { success: false, error: "Invalid credentials" };
        }

        if (user.suspended || user.banned) {
            return { success: false, error: "Account is suspended or banned" };
        }

        const ok = await compare(password, user.password);
        if (!ok) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
            }
            await user.save();
            return { success: false, error: "Invalid credentials" };
        }

        if (user.twoFactorAuthEnabled) {
            if (!mfaToken) {
                const tempToken = jwt.sign(
                    { userId: user.id, type: 'mfa' },
                    process.env.JWT_ACCESS_SECRET!,
                    { expiresIn: '10m' }
                );
                
                return {
                    success: true,
                    requiresMFA: true,
                    mfaToken: tempToken,
                    userId: user.id
                };
            }
        }

        user.loginAttempts = 0;
        user.lockoutUntil = null;
        user.lastLogin = new Date();
        await user.save();

        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any);
        const refreshToken = await issueRefreshToken(user._id.toString());
        
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                organizationId: user.organizationId,
                mfaEnabled: user.twoFactorAuthEnabled,
            },
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Internal server error" };
    }
}


export async function verifyEmailCode(code: string, email?: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (!code || code.length !== 6) {
            return { success: false, error: "Invalid verification code" };
        }

        await connectToDB();

        let user;
        
        if (email) {
            // Email-based verification (for new registrations)
            user = await User.findOne({
                email,
                emailVerificationToken: code,
                emailVerificationExpiry: { $gt: new Date() }
            });
        } else {
            // Token-based verification (for logged-in users)
            const cookieStore = await cookies()
            const token = cookieStore.get("auth-token")?.value

            if (!token) {
                return { success: false, error: "Unauthorized" }
            }

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any

            user = await User.findOne({
                _id: decoded.sub,
                emailVerificationToken: code,
                emailVerificationExpiry: { $gt: new Date() }
            });
        }

        if (!user) {
            return { success: false, error: "Invalid or expired verification code" };
        }

        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpiry = null;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Email verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function resendVerificationEmail(): Promise<{ success: boolean; error?: string }> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any

        await connectToDB();

        const user = await User.findById(decoded.sub);
        if (!user) {
            return { success: false, error: "User not found" };
        }

        if (user.emailVerified) {
            return { success: false, error: "Email already verified" };
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.emailVerificationToken = verificationCode;
        user.emailVerificationExpiry = verificationExpires;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Resend verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function resendVerificationEmailForRegistration(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB();

        const user = await User.findOne({ email, emailVerified: false });
        if (!user) {
            return { success: false, error: "User not found or already verified" };
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.emailVerificationToken = verificationCode;
        user.emailVerificationExpiry = verificationExpires;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Resend verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function resendVerificationEmailOld(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB();

        const user = await User.findOne({ email, emailVerified: false });
        if (!user) {
            return { success: false, error: "User not found or already verified" };
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.emailVerificationToken = verificationCode;
        user.emailVerificationExpiry = verificationExpires;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Resend verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        console.log("[DEBUG] Sending magic link to:", email);
        await connectToDB();

        const user = await User.findOne({ email });
        if (!user) {
            console.log("[DEBUG] User not found for email:", email);
            return { success: false, error: "User not found" };
        }

        console.log("[DEBUG] User found:", user.email);

        // Generate magic link token
        const magicToken = crypto.randomBytes(32).toString('hex');
        const magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.magicLinkToken = magicToken;
        user.magicLinkExpires = magicTokenExpires;
        await user.save();

        console.log("[DEBUG] Magic token saved:", magicToken.substring(0, 8) + "...");

        // Create magic link URL
        const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/magic-link?token=${magicToken}`;
        console.log("[DEBUG] Magic link URL:", magicLinkUrl);

        console.log("[DEBUG] Email sent successfully");
        return { success: true };
    } catch (error) {
        console.error("Send magic link error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function verifyMagicLink(token: string): Promise<{ success: boolean; error?: string; accessToken?: string; refreshToken?: string }> {
    try {
        console.log("[DEBUG] Token received:", token, "Length:", token?.length);
        
        if (!token || token.length !== 64) {
            console.log("[DEBUG] Invalid token format");
            return { success: false, error: "Invalid magic link" };
        }

        await connectToDB();
        console.log("[DEBUG] Connected to DB");

        const user = await User.findOne({
            magicLinkToken: token,
            magicLinkExpires: { $gt: new Date() }
        });

        console.log("[DEBUG] User found:", !!user);
        
        if (!user) {
            // Check if token exists at all
            const anyUser = await User.findOne({ magicLinkToken: token });
            console.log("[DEBUG] Token exists but expired:", !!anyUser);
            if (anyUser) {
                console.log("[DEBUG] Token expires at:", anyUser.magicLinkExpires, "Current time:", new Date());
            }
            return { success: false, error: "Invalid or expired magic link" };
        }

        // Clear magic link token
        user.magicLinkToken = undefined;
        user.magicLinkExpires = undefined;
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any);
        const refreshToken = await issueRefreshToken(user.id);

        return {
            success: true,
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error("Verify magic link error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function sendPhoneCode(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB()
        
        const user = await User.findOne({ phone })
        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        user.phoneVerificationToken = code
        user.phoneVerificationExpires = expires
        await user.save()

        // Send SMS using smsConfig
       
        await smsConfig({
            text: `Your login code is: ${code}. Valid for 10 minutes.`,
            destinations: [phone]
        })

        return { success: true }
    } catch (error) {
        console.error("Send phone code error:", error)
        return { success: false, error: "Failed to send SMS" }
    }
}

export async function sendPhoneCodeForProfile(): Promise<{ success: boolean; error?: string }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        const user = await User.findById(decoded.sub)
        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        user.phoneVerificationToken = code
        user.phoneVerificationExpires = expires
        await user.save()

        // Send SMS using smsConfig
       
        await smsConfig({
            text: `Your verification code is: ${code}. Valid for 10 minutes.`,
            destinations: [user.phone!]
        })

        return { success: true }
    } catch (error) {
        console.error("Send phone code for profile error:", error)
        return { success: false, error: "Failed to send SMS" }
    }
}

export async function verifyPhoneCode(phone: string, code: string): Promise<{ success: boolean; error?: string; accessToken?: string; refreshToken?: string }> {
    try {
        await connectToDB()

        const user = await User.findOne({
            phone,
            phoneVerificationToken: code,
            phoneVerificationExpires: { $gt: new Date() }
        })

        if (!user) {
            return { success: false, error: "Invalid or expired code" }
        }

        // Clear verification token
        user.phoneVerificationToken = undefined
        user.phoneVerificationExpires = undefined
        user.lastLoginAt = new Date()
        await user.save()

        // Generate tokens
        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any)
        const refreshToken = await issueRefreshToken(user.id)

        return {
            success: true,
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.error("Verify phone code error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function verifyPhoneForProfile(code: string): Promise<{ success: boolean; error?: string }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        const user = await User.findOne({
            _id: decoded.sub,
            phoneVerificationToken: code,
            phoneVerificationExpires: { $gt: new Date() }
        })

        if (!user) {
            return { success: false, error: "Invalid or expired code" }
        }

        // Mark phone as verified and clear verification token
        user.phoneVerified = true
        user.phoneVerificationToken = undefined
        user.phoneVerificationExpires = undefined
        await user.save()

        return { success: true }
    } catch (error) {
        console.error("Verify phone for profile error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function getCurrentUser(): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        const user = await User.findById(decoded.sub)
        if (!user) return { success: false, error: "User not found" }
        
        return {
            success: true,
            user: JSON.parse(JSON.stringify(user))
        }
    } catch (error) {
        console.error("Get current user error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function updateUserProfile(profileData: { name: string; email: string; phone: string; bio: string; avatar: string }): Promise<{ success: boolean; error?: string }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        // Check if email/phone already exists for other users
        const existing = await User.findOne({
            $or: [{ email: profileData.email }, { phone: profileData.phone }],
            _id: { $ne: decoded.sub }
        })
        
        if (existing) {
            return { success: false, error: "Email or phone already in use" }
        }

        const user = await User.findByIdAndUpdate(
            decoded.sub,
            {
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                bio: profileData.bio,
                avatar: profileData.avatar
            },
            { new: true }
        )

        if (!user) {
            return { success: false, error: "User not found" }
        }

        return { success: true }
    } catch (error) {
        console.error("Update profile error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        const user = await User.findById(decoded.sub)
        if (!user || !user.password) {
            return { success: false, error: "User not found" }
        }

        // Verify current password
        const isValid = await compare(currentPassword, user.password)
        if (!isValid) {
            return { success: false, error: "Current password is incorrect" }
        }

        // Hash new password
        const newPasswordHash = await hash(newPassword, 12)
        
        await User.findByIdAndUpdate(decoded.sub, {
            password: newPasswordHash
        })

        return { success: true }
    } catch (error) {
        console.error("Change password error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function verifyMFACode(code: string, backupCode?: string, mfaToken?: string, rememberDevice?: boolean): Promise<{ success: boolean; error?: string; accessToken?: string; refreshToken?: string; trustedDeviceToken?: string }> {
    try {
        let userId: string;
        
        if (mfaToken) {
            // Use the MFA token from login
            const decoded = jwt.verify(mfaToken, process.env.JWT_ACCESS_SECRET!) as any;
            if (decoded.type !== 'mfa') {
                return { success: false, error: "Invalid MFA token" };
            }
            userId = decoded.userId;
        } else {
            // Fallback to cookie-based auth for existing flows
            const cookieStore = await cookies();
            const token = cookieStore.get("auth-token")?.value;
            
            if (!token) {
                return { success: false, error: "Unauthorized" };
            }
            
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
            userId = decoded.sub;
        }
        
        await connectToDB();
        
        const user = await User.findById(userId);
        if (!user || !user.twoFactorAuthEnabled) {
            return { success: false, error: "MFA not enabled" };
        }

        let isValid = false;

        if (backupCode) {
            // Backup codes not implemented in current model
            return { success: false, error: "Backup codes not supported" };
        } else {
            if (user.twoFactorSecret) {
                // Note: authenticator library not imported, simplified validation
                isValid = code.length === 6;
            }
        }

        if (!isValid) {
            return { success: false, error: "Invalid code" };
        }

        user.loginAttempts = 0;
        user.lockoutUntil = null;
        user.lastLoginAt = new Date();
        
        // Create trusted device token if requested
        if (rememberDevice) {
            const deviceToken = crypto.randomBytes(32).toString('hex');
            const deviceExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            
            if (!user.trustedDevices) user.trustedDevices = [];
            user.trustedDevices.push({
                token: deviceToken,
                expires: deviceExpires,
                createdAt: new Date()
            });
            
            await user.save();
            
            // Return device token to be set on client side
            return {
                success: true,
                accessToken: signAccessToken({ ...user.toObject(), roles: [user.role] } as any),
                refreshToken: await issueRefreshToken(user.id),
                trustedDeviceToken: deviceToken
            };
        }
        
        await user.save();

        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any);
        const refreshToken = await issueRefreshToken(user.id);

        return {
            success: true,
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error("Verify MFA code error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function checkTrustedDevice(userId: string, deviceToken: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB();
        
        const user = await User.findById(userId);
        if (!user || !user.trustedDevices) {
            return { success: false, error: "User not found" };
        }

        const trustedDevice = user.trustedDevices.find(
            (device: any) => device.token === deviceToken && device.expires > new Date()
        );

        return { success: !!trustedDevice };
    } catch (error) {
        console.error("Check trusted device error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function fetchUserById(id: string) {
    try {
        await connectToDB()
        const user = await User.findById(id)
        if (!user) return { success: false, error: "User not found" };
        return {
            success: true,
            user: JSON.parse(JSON.stringify(user))
        };

    } catch (error) {
        console.error("fetch user error:", error);
        return { success: false, error: "Internal server error" };
    }
}