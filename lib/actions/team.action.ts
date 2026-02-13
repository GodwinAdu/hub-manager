"use server"

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import Team from "../models/team.model";



async function _createTeam(user: User, values: { name: string }) {
    try {
        const { name } = values

        if (!user) throw new Error('user not logged in');

        const organizationId = user.organizationId as string;

        await connectToDB();

        const existingTeam = await Team.findOne({ name });

        if (existingTeam) {
            throw new Error("Team already exists");
        }

        const team = new Team({
            organizationId,
            name,
            createdBy: user?._id,
            action_type: "created",
        });

        // const history = new History({
        //     organizationId,
        //     actionType: 'DEPARTMENT_CREATED', // Use a relevant action type
        //     details: {
        //         itemId: department._id,
        //         deletedAt: new Date(),
        //     },
        //     message: `${user.fullName} created new department with (ID: ${department._id}) on ${new Date().toLocaleString()}.`,
        //     performedBy: user._id, // User who performed the action,
        //     entityId: department._id,  // The ID of the deleted unit
        //     entityType: 'DEPARTMENT',  // The type of the entity
        // });

        await Promise.all([
            team.save(),
            // history.save()
        ]);

    } catch (error) {
        console.log("unable to create new team", error)
        throw error;
    }
}

async function _getAllTeams(user: User) {
    try {

        if (!user) throw new Error('user not logged in');

        const organizationId = user.organizationId as string;

        await connectToDB();

        const teams = await Team.find({ organizationId: organizationId as any })
            .populate("createdBy", "fullName")

        if (!teams || teams.length === 0) {

            console.log("teams don't exist");

            return []; // or throw an error if you want to handle it differently
        }

        return JSON.parse(JSON.stringify(teams));

    } catch (error) {
        console.error("Error fetching Teams:", error);
        throw error; 
    }
}


export const getAllTeams = await withAuth(_getAllTeams);
export const createTeam = await withAuth(_createTeam);

