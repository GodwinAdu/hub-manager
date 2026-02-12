import { Model, model, models, Schema } from "mongoose";

interface IUser extends Document {
    organizationId: Schema.Types.ObjectId
    position?: string
    fullName: string
    imgUrl?: string
    dob?: Date
    email: string
    gender?: string
    phone?: string
    password: string
    religion?: string
    maritalStatus?: string
    addresses: {
        street?: string,
        city?: string
        state?: string  
        zipCode?: string
        country?: string
    }
    emergencyContact?: object
    currentAddress?: string
    permanentAddress?: string
    lineManagerId?: Schema.Types.ObjectId
    role: string
    identification: {
        idCardType?: string,
        idCard?: string
        socialSecurityNumber?: string
        taxIdentificationNumber?: string
        workPermit?: string
        bankDetails?: {
            accountName?: string
            accountNumber?: string
            bankName?: string
        }
    },
    employment: {
        employeeID: string
        dateOfJoining: Date
        jobTitle?: string
        departmentId?: Schema.Types.ObjectId
        workSchedule?: "Full-time" | "Part-time"
    }
    professionalDetails: {
        highestDegree?: {
            degree?: string
            institution?: string
            year?: number
        },
        certifications?: string[]
        specialization?: string[]
        experienceYears?: number
        previousEmployment?: {
            school?: string,
            position?: string
            duration?: string
        }[]
        references?: {
            name?: string,
            contact?: string
            relationship?: string
        }[]
        backgroundCheck?: {
            criminalRecord?: boolean,
            details?: string
        }
        additionalInfo?: {
            extracurricularActivities?: string[]
            specialSkills?: string[]
            notes?: string
        }
    },
    medicalHistory: {
        medicalConditions?: string[]
        medications?: string[]
        allergies?: string[]
        immunizations?: {
            vaccineName?: string
            dateAdministered?: Date
            administeredBy?: string
        }[]
        medicalNotes?: string
    }
    salaryId?: Schema.Types.ObjectId
    resetPasswordToken?: string
    resetPasswordExpiry?: Date
    banned: boolean
    suspended: boolean
    loginAttempts: number
    lockoutUntil: Date | null
    lastLogin: Date | null
    emailVerificationToken: string | null
    emailVerificationExpiry: Date | null
    emailVerified: boolean
    phoneVerified: boolean
    phoneVerificationToken?: string
    phoneVerificationExpires?: Date
    magicLinkToken?: string
    magicLinkExpires?: Date
    lastLoginAt?: Date
    twoFactorAuthEnabled: boolean
    twoFactorSecret?: string
    trustedDevices?: Array<{
        token: string
        expires: Date
        createdAt: Date
    }>
    isActive: boolean
    attendanceMarkedToday: boolean
    leaveBalance: number
    onLeave: boolean

    createdBy?: Schema.Types.ObjectId
    mod_flag: boolean
    del_flag: boolean
    modifiedBy?: Schema.Types.ObjectId
    deletedBy?: Schema.Types.ObjectId
    deletedAt?: Date | null

    action_type?: string | null
}


const UserSchema = new Schema<IUser>({
     organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    lineManagerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    position:{
        type:String
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    imgUrl: {
        type: String,
        default: ""
    },
    dob: {
        type: Date,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    religion: {
        type: String,
    },
    maritalStatus: {
        type: String,
    },
    addresses: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    emergencyContact: {
        type: Object,
    },
    currentAddress: {
        type: String,
    },
    permanentAddress: {
        type: String,
    },
    role: {
        type: String,
        required: true
    },
    identification: {
        idCardType: {
            type: String,
        },
        idCard: {
            type: String,
        },
        socialSecurityNumber: { type: String },
        taxIdentificationNumber: { type: String },
        workPermit: { type: String },
        bankDetails: {
            accountName: { type: String },
            accountNumber: { type: String },
            bankName: { type: String },
        },
    },
    employment: {
        employeeID: { type: String, required: true, unique: true },
        dateOfJoining: { type: Date, required: true },
        jobTitle: { type: String },
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            default: null
        },
        workSchedule: { type: String, enum: ["Full-time", "Part-time"] },
    },
    professionalDetails: {
        highestDegree: {
            degree: { type: String },
            institution: { type: String },
            year: { type: Number },
        },
        certifications: [{ type: String }],
        specialization: [{ type: String }],
        experienceYears: { type: Number },
        previousEmployment: [
            {
                school: { type: String },
                position: { type: String },
                duration: { type: String }, // e.g., "2018-2022"
            },
        ],
        references: [
            {
                name: { type: String },
                contact: { type: String },
                relationship: { type: String },
            },
        ],
        backgroundCheck: {
            criminalRecord: { type: Boolean, default: false },
            details: { type: String },
        },
        additionalInfo: {
            extracurricularActivities: [{ type: String }],
            specialSkills: [{ type: String }],
            notes: { type: String },
        },
    },
    medicalHistory: {
        medicalConditions: [{
            type: String,
        }],
        medications: [{
            type: String
        }],
        allergies: [{
            type: String
        }],
        immunizations: [{
            vaccineName: {
                type: String,
            },
            dateAdministered: {
                type: Date,
            },
            administeredBy: {
                type: String,
            }
        }],
        medicalNotes: {
            type: String,
        }
    },
    salaryId: {
        type: Schema.Types.ObjectId,
        ref: 'SalaryStructure',
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpiry: {
        type: Date,
        default: null,
    },
    banned:{
        type:Boolean,
        default:false
    },
    suspended:{
        type:Boolean,
        default:false
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockoutUntil: {
        type: Date,
        default: null
    },  
    lastLogin: {
        type: Date,
        default: null
    },
    emailVerificationToken: {
        type: String,
        default: null,
    },
    emailVerificationExpiry: {
        type: Date,
        default: null,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },

    phoneVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerificationToken: {
        type: String,
        default: null,
    },
    phoneVerificationExpires: {
        type: Date,
        default: null,
    },
    magicLinkToken: {
        type: String,
        default: null,
    },
    magicLinkExpires: {
        type: Date,
        default: null,
    },
    lastLoginAt: {
        type: Date,
        default: null,
    },
    twoFactorAuthEnabled: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: {
        type: String,
        default: null,
    },
    trustedDevices: [{
        token: { type: String },
        expires: { type: Date },
        createdAt: { type: Date, default: Date.now },
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    attendanceMarkedToday: {
        type: Boolean,
        default: false,
    },
    leaveBalance: {
        type: Number,
        default: 0,
    },
    onLeave: {
        type: Boolean,
        default: false,
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    mod_flag: {
        type: Boolean,
        default: false
    },
    del_flag: {
        type: Boolean,
        default: false
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    },

    action_type: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
    versionKey: false,
})

type UserModelType = Model<IUser>

const User: UserModelType = models.User ?? model<IUser>("User", UserSchema)

export default User