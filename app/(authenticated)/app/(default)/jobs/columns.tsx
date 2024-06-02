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
import { archiveJobAction, restoreJobAction } from "./actions";
import { toast } from "sonner";

export const columns: ColumnDef<
  JobSchema & {
    id: string;
    createdAt: Date;
    isArchived: boolean;
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
];
