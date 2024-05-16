"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "@/components/internals/data-table-view-options";
import { DataTablePagination } from "@/components/internals/data-table-pagination";
import { DocumentItemIncluded } from "@/prisma/db/document";
import { SessionItemIncluded } from "@/prisma/db/session";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  action?: (data: DocumentItemIncluded[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  action,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <div className="border border-solid border-zinc-200">
        <Table>
          <TableHeader className="border-b border-solid border-zinc-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b hover:bg-zinc-100 h-12 border-solid border-zinc-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}

                  <TableCell>
                    <div className="flex flex-1 justify-center items-center gap-2 h-full">
                      <Button
                        variant={"default"}
                        size={"sm"}
                        onClick={() => {
                          const org = row.original as SessionItemIncluded;
                          router.push(`/app/session/${org?.id}`);
                        }}
                      >
                        Launch
                      </Button>

                      <Button variant={"default"} size={"sm"}>
                        Archive
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <h1 className="text-lg font-medium sm:text-xl">
                    No interview session!
                  </h1>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <DataTablePagination table={table} action={action} />
      </div>
    </>
  );
}
