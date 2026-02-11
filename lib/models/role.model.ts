import { Schema, model, models, Model } from "mongoose";

interface IRole extends Document {
    organizationId: Schema.Types.ObjectId
    name: string
    displayName: string
    description?: string
    permissions:Record<string, boolean>
    createdBy?: Schema.Types.ObjectId | null
    modifiedBy?: Schema.Types.ObjectId | null
    deletedBy?: Schema.Types.ObjectId | null
    mod_flag?: boolean
    del_flag?: boolean
    action_type?: string
}

const RoleSchema: Schema<IRole> = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    description: { type: String },
    permissions: {
        // core modules
        dashboard: {
            type: Boolean,
            default: false
        },
        systemConfig: {
            type: Boolean,
            default: false
        },
        userManagement: {
            type: Boolean,
            default: false,
        },
        hrManagement: {
            type: Boolean,
            default: false,
        },
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
    action_type: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
});

type RoleModel = Model<IRole>

const Role: RoleModel = models.Role ?? model<IRole>("Role", RoleSchema);

export default Role;