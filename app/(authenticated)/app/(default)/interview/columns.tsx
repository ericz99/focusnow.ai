"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SessionSchema } from "@/prisma/db/session";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<
  SessionSchema & {
    id: string;
    createdAt: Date;
    isFinished: boolean;
    endTime: string | null;
    isActive: boolean;
    additionalInfo: string | null;
  }
>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const org = row.original;
      console.log("orggg", org);

      return org?.isActive &&
        ((org.endTime! && new Date().getTime() > Number(org.endTime!)) ||
          org.isFinished) ? (
        <p className="flex items-center gap-4">
          {org.name} <Badge>Completed</Badge>
        </p>
      ) : (
        <p>{org.name}</p>
      );
    },
  },
  {
    accessorKey: "additionalInfo",
    header: "Additional Context",
    cell: ({ row }) => {
      const org = row.original;
      const text = org.additionalInfo;

      return <p className="max-w-xs truncate">{text}</p>;
    },
  },
];
