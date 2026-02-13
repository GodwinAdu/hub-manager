"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Edit,
    Trash2,
    Eye,
    UserX,
    UserCheck,
    Key,
    Mail,
    Shield,
    Clock,
    MapPin,
    Award
} from "lucide-react";
import { CellAction } from "@/components/table/cell-action";
import { toast } from "sonner";

// Define the Staff type based on User model
export type StaffMember = {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    imgUrl?: string;
    role: string;
    position?: string;
    employment?: {
        employeeID: string;
        jobTitle?: string;
        departmentId?: {
            _id: string;
            name: string;
        };
        workSchedule?: "Full-time" | "Part-time";
    };
    lineManagerId?: {
        _id: string;
        fullName: string;
        email: string;
    };
    isActive: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdBy?: {
        _id: string;
        fullName: string;
    };
    createdAt: string;
}

const handleDelete = async (id: string): Promise<void> => {
    try {
        // await deleteStaffMember(id);
        toast.success("Staff member deleted successfully");
        window.location.reload();
    } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete staff member");
        throw error;
    }
}

export const columns: ColumnDef<StaffMember>[] = [
    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => {
            const staff = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={staff.imgUrl || ""} alt={staff.fullName} />
                        <AvatarFallback>{staff.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{staff.fullName}</span>
                        <span className="text-xs text-muted-foreground">{staff.employment?.employeeID || "N/A"}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const staff = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.email}</span>
                    {staff.emailVerified && (
                        <Badge variant="outline" className="text-xs">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Verified
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role;
            const roleColors: Record<string, string> = {
                owner: "bg-purple-500/10 text-purple-500 border-purple-500/20",
                admin: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                manager: "bg-green-500/10 text-green-500 border-green-500/20",
                staff: "bg-gray-500/10 text-gray-500 border-gray-500/20",
            };
            return (
                <Badge variant="outline" className={roleColors[role.toLowerCase()] || roleColors.staff}>
                    <Shield className="h-3 w-3 mr-1" />
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "employment.departmentId",
        header: "Department",
        cell: ({ row }) => {
            const department = row.original.employment?.departmentId;
            return (
                <div className="flex items-center gap-2">
                    {department ? (
                        <>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{department.name}</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "employment.jobTitle",
        header: "Job Title",
        cell: ({ row }) => {
            const jobTitle = row.original.employment?.jobTitle || row.original.position;
            return (
                <div className="flex items-center gap-2">
                    {jobTitle ? (
                        <>
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span>{jobTitle}</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">Not specified</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "employment.workSchedule",
        header: "Schedule",
        cell: ({ row }) => {
            const schedule = row.original.employment?.workSchedule;
            return schedule ? (
                <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {schedule}
                </Badge>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.original.isActive;
            return (
                <Badge variant={isActive ? "default" : "destructive"}>
                    {isActive ? (
                        <>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Active
                        </>
                    ) : (
                        <>
                            <UserX className="h-3 w-3 mr-1" />
                            Inactive
                        </>
                    )}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const staff = row.original;
            return (
                <CellAction
                    data={staff}
                    onDelete={handleDelete}
                    actions={[
                        {
                            label: "View Profile",
                            type: "view",
                            href: `/dashboard/members/${staff._id}`,
                            icon: <Eye className="h-4 w-4" />,
                        },
                        {
                            label: "Edit Profile",
                            type: "edit",
                            href: `/dashboard/members/${staff._id}/edit`,
                            icon: <Edit className="h-4 w-4" />,
                        },
                        {
                            label: "Delete",
                            type: "delete",
                            icon: <Trash2 className="h-4 w-4" />,
                        },
                    ]}
                />
            );
        },
    },
];
