"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Edit,
    Trash2,
    Eye,
    Building2,
    Calendar,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { CellAction } from "@/components/table/cell-action";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Department {
    _id: string;
    name: string;
    organizationId: string;
    createdBy?: {
        _id: string;
        fullName: string;
        avatarUrl?: string;
    };
    mod_flag: boolean;
    del_flag: boolean;
    createdAt: string;
    updatedAt: string;
    action_type?: string;
    [key: string]: any;
}

const handleDelete = async (id: string): Promise<void> => {
    try {
        // await deleteDepartment(id);
        toast.success("Department deleted successfully");
        window.location.reload();
    } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete department");
        throw error;
    }
}

export const columns: ColumnDef<Department>[] = [
    {
        accessorKey: "name",
        header: "Department Name",
        cell: ({ row }) => {
            const department = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{department.name}</span>
                       
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const department = row.original;
            const createdDate = new Date(department.createdAt);
            
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
            const department = row.original;
            
            if (department.del_flag) {
                return (
                    <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Deleted
                    </Badge>
                );
            }
            
            if (department.mod_flag) {
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
            const department = row.original;
            return (
                <CellAction
                    data={department}
                    onDelete={handleDelete}
                    actions={[
                        {
                            label: "View Details",
                            type: "view",
                            href: `/dashboard/departments/${department._id}`,
                            icon: <Eye className="h-4 w-4" />,
                        },
                        {
                            label: "Edit Department",
                            type: "edit",
                            href: `/dashboard/departments/${department._id}/edit`,
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
        }
    },
];
