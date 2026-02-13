"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Edit,
    Trash2,
    Eye,
    Users,
    UserPlus,
    Calendar,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { CellAction } from "@/components/table/cell-action";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Team {
    _id: string;
    name: string;
    members: any[];
    createdBy?: {
        _id: string;
        fullName: string;
        avatarUrl?: string;
    };
    mod_flag: boolean;
    del_flag: boolean;
    createdAt: string;
    updatedAt: string;
    [key: string]: any; 
}

const handleDelete = async (id: string): Promise<void> => {
    try {
        // await deleteTeam(id);
        toast.success("Team deleted successfully");
        window.location.reload();
    } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete team");
        throw error;
    }
}

export const columns: ColumnDef<Team>[] = [
    {
        accessorKey: "name",
        header: "Team Name",
        cell: ({ row }) => {
            const team = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{team.name}</span>
                       
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "members",
        header: "Members",
        cell: ({ row }) => {
            const team = row.original;
            const memberCount = team.members?.length || 0;
            
            return (
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{memberCount}</span>
                        <span className="text-xs text-muted-foreground">
                            {memberCount === 1 ? 'member' : 'members'}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const team = row.original;
            const createdDate = new Date(team.createdAt);
            
            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="text-sm">
                            {createdDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(createdDate, { addSuffix: true })}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => {
            const createdBy = row.original.createdBy;
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={createdBy?.avatarUrl || ""} alt={createdBy?.fullName || "User"} />
                        <AvatarFallback>{createdBy?.fullName ? createdBy.fullName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{createdBy?.fullName || "Unknown"}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const team = row.original;
            
            if (team.del_flag) {
                return (
                    <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Deleted
                    </Badge>
                );
            }
            
            if (team.mod_flag) {
                return (
                    <Badge variant="secondary" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Modified
                    </Badge>
                );
            }
            
            return (
                <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const team = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/teams/${team._id}/add-members`}>
                        <Button variant="outline" size="sm" className="gap-1">
                            <UserPlus className="h-4 w-4" />
                            Add Members
                        </Button>
                    </Link>
                    <CellAction
                        data={team}
                        onDelete={handleDelete}
                        actions={[
                            {
                                label: "View Details",
                                type: "view",
                                href: `/dashboard/teams/${team._id}`,
                                icon: <Eye className="h-4 w-4" />,
                            },
                            {
                                label: "Edit Team",
                                type: "edit",
                                href: `/dashboard/teams/${team._id}/edit`,
                                icon: <Edit className="h-4 w-4" />,
                            },
                            {
                                label: "Delete",
                                type: "delete",
                                icon: <Trash2 className="h-4 w-4" />,
                            },
                        ]}
                    />
                </div>
            );
        }
    },
];
