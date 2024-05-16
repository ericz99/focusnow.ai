"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SessionSchema } from "@/prisma/db/session";

export const columns: ColumnDef<
  SessionSchema & {
    id: string;
    createdAt: Date;
  }
>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
