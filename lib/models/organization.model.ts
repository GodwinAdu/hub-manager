import {  Model, model, models, Schema } from "mongoose"

interface IOrganization {
  owner?: Schema.Types.ObjectId | null
  organizationCode: string
  logo?: string
  foundedYear?: number
  name: string
  motto?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  addresses: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  settings: {
    admissionOpen?: boolean
    allowGuestAccess?: boolean
    allowOnlineAdmission?: boolean
    timezone?: string
    currency?: string
    language?: string
    dateFormat?: string
  }
  notifications: {
    overdueSubscriptionAlert?: boolean
    subscriptionRenewalReminder?: boolean
    paymentConfirmation?: boolean
    invoiceGenerated?: boolean
    attendanceAlerts?: boolean
    reportCardRelease?: boolean
    examSchedule?: boolean
    parentMeetingReminder?: boolean
    salaryPayment?: boolean
    staffMeeting?: boolean
    unauthorizedLoginAttempt?: boolean
    accountSuspension?: boolean
    emailNotifications?: boolean
    pushNotifications?: boolean
  }
  recruitment?: Array<{
    position: string
    category: "essential" | "recommended" | "optional"
    requiredCount: number
    currentCount: number
    status: "needed" | "filled" | "pending"
  }>
  subscriptionPlan: {
    period: {
      frequency: string
      value: number
      price: number
    }
    renewDate?: Date
    expiryDate?: Date
    plan: "basic" | "pro" | "custom"
    currentStudent: number
  }
  paymentSettings: {
    paymentMethods: Array<{
      name: string
      enabled: boolean
      processingFee: number
      minimumAmount: number
    }>
    paymentProcessors: Array<{
      name: "Paystack" | "Stripe"
      apiKey: string
      secretKey: string
      enabled: boolean
    }>
    defaultCurrency: string
    acceptedCurrencies: string[]
    partialPayments: boolean
  }
  security: {
    loginRestrictions?: boolean
    multiFactorAuth?: boolean
    passwordResetTokenExpiry?: number
    accountLockoutThreshold?: number
    accountLockoutDuration?: number
    sessionTimeout?: number
    dataEncryption?: boolean
    auditLogs?: {
      enabled: boolean
      retentionPeriod: number
    }
    emailVerification?: boolean
    phoneNumberVerification?: boolean
    ipWhitelisting?: boolean
  }
  modules: {
    dashboard?: boolean
    systemConfig?: boolean
    classManagement?: boolean
    studentManagement?: boolean
    employeeManagement?: boolean
    manageAttendance?: boolean
    onlineLearning?: boolean
    examsManagement?: boolean
    inventory?: boolean
    hostelManagement?: boolean
    library?: boolean
    depositAndExpense?: boolean
    message?: boolean
    report?: boolean
    canteenManagement?: boolean
    transportManagement?: boolean
    feesManagement?: boolean
    hrManagement?: boolean
    healthManagement?: boolean
    history?: boolean
    trash?: boolean
  }
  acceptedTerms?: boolean
  banned?: boolean
  freezed?: boolean
  createdBy?: Schema.Types.ObjectId | null
  modifiedBy?: Schema.Types.ObjectId | null
  mod_flag?: boolean
  del_flag?: boolean
  action_type?: "create" | "update" | "delete"
}

const PaymentProcessorSchema = new Schema({
  name: { type: String, default: "Paystack", enum: ["Paystack", "Stripe"] },
  apiKey: { type: String, default: "" },
  secretKey: { type: String, default: "" },
  enabled: { type: Boolean, default: false },
})

const PaymentMethodSchema = new Schema({
  name: { type: String },
  enabled: { type: Boolean, default: false },
  processingFee: { type: Number, default: 0 },
  minimumAmount: { type: Number, default: 0 },
})

const RecruitmentSchema = new Schema({
  position: { type: String },
  category: { type: String, enum: ["essential", "recommended", "optional"], default: "recommended" },
  requiredCount: { type: Number, default: 1 },
  currentCount: { type: Number, default: 0 },
  status: { type: String, enum: ["needed", "filled", "pending"], default: "needed" },
})

const OrganizationSchema: Schema<IOrganization> = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  organizationCode: { type: String, unique: true, required: true },
  logo: { type: String, default: "" },
  foundedYear: { type: Number, default: null },
  name: { type: String, required: true },
  motto: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  website: { type: String, default: "" },
  description: { type: String, default: "" },

  addresses: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },

  settings: {
    admissionOpen: { type: Boolean, default: true },
    allowGuestAccess: { type: Boolean, default: false },
    allowOnlineAdmission: { type: Boolean, default: true },
    timezone: { type: String, default: "UTC" },
    currency: { type: String, default: "GHS" },
    language: { type: String, default: "en" },
    dateFormat: { type: String, default: "MM/DD/YYYY" },
  },

  notifications: {
    overdueSubscriptionAlert: { type: Boolean, default: true },
    subscriptionRenewalReminder: { type: Boolean, default: true },
    paymentConfirmation: { type: Boolean, default: true },
    invoiceGenerated: { type: Boolean, default: false },
    attendanceAlerts: { type: Boolean, default: false },
    reportCardRelease: { type: Boolean, default: false },
    examSchedule: { type: Boolean, default: false },
    parentMeetingReminder: { type: Boolean, default: false },
    salaryPayment: { type: Boolean, default: false },
    staffMeeting: { type: Boolean, default: false },
    unauthorizedLoginAttempt: { type: Boolean, default: false },
    accountSuspension: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
  },

  recruitment: { type: [RecruitmentSchema] },

  subscriptionPlan: {
    period: {
      frequency: { type: String },
      value: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
    },
    renewDate: { type: Date },
    expiryDate: { type: Date },
    plan: { type: String, enum: ["basic", "pro", "custom"] },
    currentStudent: { type: Number, default: 0 },
  },

  paymentSettings: {
    paymentMethods: {
      type: [PaymentMethodSchema],
      default: [
        { name: "Cash", enabled: true },
        { name: "Credit Card", enabled: false },
        { name: "Bank Transfer", enabled: false },
        { name: "Mobile Money", enabled: false },
      ],
    },
    paymentProcessors: {
      type: [PaymentProcessorSchema],
      default: [{ name: "Paystack", apiKey: "", secretKey: "", enabled: false }],
    },
    defaultCurrency: { type: String, default: "GHS" },
    acceptedCurrencies: { type: [String], default: ["GHS"] },
    partialPayments: { type: Boolean, default: false },
  },

  security: {
    loginRestrictions: { type: Boolean, default: false },
    multiFactorAuth: { type: Boolean, default: false },
    passwordResetTokenExpiry: { type: Number, default: 30 },
    accountLockoutThreshold: { type: Number, default: 5 },
    accountLockoutDuration: { type: Number, default: 15 },
    sessionTimeout: { type: Number, default: 30 },
    dataEncryption: { type: Boolean, default: true },
    auditLogs: {
      enabled: { type: Boolean, default: true },
      retentionPeriod: { type: Number, default: 90 },
    },
    emailVerification: { type: Boolean, default: true },
    phoneNumberVerification: { type: Boolean, default: false },
    ipWhitelisting: { type: Boolean, default: false },
  },

  modules: {
    dashboard: { type: Boolean, default: true },
    systemConfig: { type: Boolean, default: true },
    classManagement: { type: Boolean, default: true },
    studentManagement: { type: Boolean, default: true },
    employeeManagement: { type: Boolean, default: true },
    manageAttendance: { type: Boolean, default: false },
    onlineLearning: { type: Boolean, default: false },
    examsManagement: { type: Boolean, default: false },
    inventory: { type: Boolean, default: false },
    hostelManagement: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    depositAndExpense: { type: Boolean, default: false },
    message: { type: Boolean, default: false },
    report: { type: Boolean, default: false },
    canteenManagement: { type: Boolean, default: false },
    transportManagement: { type: Boolean, default: false },
    feesManagement: { type: Boolean, default: false },
    hrManagement: { type: Boolean, default: false },
    healthManagement: { type: Boolean, default: false },
    history: { type: Boolean, default: false },
    trash: { type: Boolean, default: false },
  },

  acceptedTerms: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },
  freezed: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  modifiedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  mod_flag: { type: Boolean, default: false },
  del_flag: { type: Boolean, default: false },
  action_type: { type: String, enum: ["create", "update", "delete"], default: "create" },
}, {
  timestamps: true,
  versionKey: false,
})

type OrganizationModel = Model<IOrganization>

const Organization: OrganizationModel = models.Organization ?? model<IOrganization>("Organization", OrganizationSchema)

export default Organization
