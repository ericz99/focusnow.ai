"use client";

import { ColumnDef } from "@tanstack/react-table";
import { JobSchema } from "@/prisma/db/job";
import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<
  JobSchema & {
    createdAt: Date;
  }
>[] = [
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "company",
    header: "Company",
  },

  {
    accessorKey: "companyDetail",
    header: "Company Detail",
    cell: ({ row }) => {
      const org = row.original;
      const text = org.companyDetail;

      return <p className="max-w-xs truncate">{text}</p>;
    },
  },
  {
    accessorKey: "jobDescription",
    header: "Job Description",
    cell: ({ row }) => {
      const org = row.original;
      const text = org.jobDescription;

      return <p className="max-w-xs truncate">{text}</p>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex flex-1 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
