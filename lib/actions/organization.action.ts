"use server"

import { connectToDB } from "../connection/mongoose"
import Organization from "../models/organization.model"
import User from "../models/user.model"
import Department from "../models/deparment.model"
import Role from "../models/role.model"
import { withAuth, type User as UserType } from "../helpers/auth"
import mongoose from "mongoose"
import { hash } from "bcryptjs"

interface RegisterOrganizationData {
    name: string
    addresses: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    phone: string
    website?: string
    foundedYear: string
    description?: string
    fullName: string
    email: string
    password: string
    position: string
    phoneNumber: string
    modules: Record<string, boolean>
    plan: "basic" | "pro" | "custom"
}


export async function registerOrganization(data: RegisterOrganizationData) {
  let session: mongoose.ClientSession | null = null;
  try {
    await connectToDB();

    session = await mongoose.startSession();
    session.startTransaction();

    /* ------------------------------------------------ */
    /* 1. CHECK DUPLICATES (PARALLEL = FAST)           */
    /* ------------------------------------------------ */
    const [existingOrg, existingUser] = await Promise.all([
      Organization.findOne({ email: data.email }).session(session),
      User.findOne({ email: data.email }).session(session),
    ]);

    if (existingOrg) {
      await session.abortTransaction();
      return { success: false, error: "Organization with this email already exists" };
    }

    if (existingUser) {
      await session.abortTransaction();
      return { success: false, error: "User with this email already exists" };
    }

    /* ------------------------------------------------ */
    /* 2. CREATE ORGANIZATION                          */
    /* ------------------------------------------------ */
    const organizationCode = `ORG-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const organization = await Organization.create(
      [
        {
          organizationCode,
          name: data.name,
          addresses: data.addresses,
          phone: data.phone,
          website: data.website ?? "",
          foundedYear: Number(data.foundedYear),
          description: data.description ?? "",
          email: data.email,
          modules: data.modules,
          subscriptionPlan: {
            plan: data.plan,
            period: {
              frequency: "monthly",
              value: 1,
              price: data.plan === "basic" ? 5 : 10,
            },
            currentStudent: 0,
          },
          acceptedTerms: true,
        },
      ],
      { session }
    );

    const org = organization[0];

    /* ------------------------------------------------ */
    /* 3. HASH PASSWORD                                */
    /* ------------------------------------------------ */
    const passwordHash = await hash(data.password, 12);

    const employeeID = `EMP-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    /* ------------------------------------------------ */
    /* 4. CREATE ROLE                                  */
    /* ------------------------------------------------ */
    await Role.create(
      [
        {
          organizationId: org._id as any,
          name: "admin",
          displayName: "Administrator",
          description: "Full system access",
          permissions: {
            dashboard: true,
            systemConfig: true,
            userManagement: true,
            hrManagement: true,
          },
        },
      ],
      { session }
    );

    /* ------------------------------------------------ */
    /* 5. CREATE DEPARTMENT                            */
    /* ------------------------------------------------ */
    const departments = await Department.create(
      [
        {
          organizationId: org._id as any,
          name: "Administration",
          createdBy: null,
          action_type: "create",
        },
      ],
      { session }
    );

    const department = departments[0];

    /* ------------------------------------------------ */
    /* 6. CREATE USER                                  */
    /* ------------------------------------------------ */
    const users = await User.create(
      [
        {
          organizationId: org._id as any,
          fullName: data.fullName,
          email: data.email,
          password: passwordHash,
          phone: data.phoneNumber,
          position: data.position,
          role: "admin",
          employment: {
            employeeID,
            dateOfJoining: new Date(),
            departmentId: department._id as any,
          },
          isActive: true,
          emailVerified: false,
        },
      ],
      { session }
    );

    const user = users[0];

    /* ------------------------------------------------ */
    /* 7. UPDATE DEPARTMENT CREATOR                    */
    /* ------------------------------------------------ */
    await Department.findByIdAndUpdate(
      department._id,
      { createdBy: user._id as any },
      { session }
    );


    /* ------------------------------------------------ */
    /* 8. SET OWNER                                    */
    /* ------------------------------------------------ */
    await Organization.findByIdAndUpdate(
      org._id,
      { owner: user._id as any },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    console.error("Register organization error:", error);
    return { success: false, error: "Internal server error" };
  }
}


async function _fetchOrganizationUserById(user: UserType) {
    try {
        if (!user) throw new Error("User not authenticated")

        const organizationId = user.organizationId as string

        if (!organizationId) {
            throw new Error("User does not belong to any organization")
        }

        await connectToDB()

        const organization = await Organization.findById(organizationId).populate("owner", "fullName email")

        if (!organization) {
            throw new Error("Organization not found")
        }

        return JSON.parse(JSON.stringify(organization))
    } catch (error) {
        console.error("Fetch organization error:", error)
        throw new Error("Failed to fetch organization")
    }
}

export const fetchOrganizationUserById = await withAuth(_fetchOrganizationUserById)