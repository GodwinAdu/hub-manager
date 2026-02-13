"use server"

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import UserModel from "../models/user.model";


async function _getAllStaff(user: User) {
    try {

        if (!user) throw new Error('user not logged in');

        const organizationId = user.organizationId as string;

        await connectToDB();

        // Fetch all users (staff) for this organization, excluding soft-deleted records
        const staffs = await UserModel.find({ 
            organizationId: organizationId as any,
            del_flag: false  
        })
            .populate("createdBy", "fullName")
            .populate("employment.departmentId", "name")
            .populate("lineManagerId", "fullName email")
            .sort({ createdAt: -1 }); 

        if (!staffs || staffs.length === 0) {
            console.log("staffs don't exist");
            return []; 
        }

        return JSON.parse(JSON.stringify(staffs));

    } catch (error) {
        console.error("Error fetching Staffs:", error);
        throw error; 
    }
}


export const getAllStaff = await withAuth(_getAllStaff);

