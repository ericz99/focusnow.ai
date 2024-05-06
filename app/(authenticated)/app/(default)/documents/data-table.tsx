"use client";

import { useState } from "react";

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

import { DataTableViewOptions } from "@/components/internals/data-table-view-options";
import { DataTablePagination } from "@/components/internals/data-table-pagination";
import { DocumentItemIncluded } from "@/prisma/db/document";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  deleteDocumentAction: (data: DocumentItemIncluded[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  deleteDocumentAction,
}: DataTableProps<TData, TValue>) {
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

      <div className="border border-solid rounded-md">
        <Table>
          <TableHeader className="border-b border-solid border-zinc-400">
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <h1 className="text-lg font-medium sm:text-xl">
                    No files uploaded yet
                  </h1>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Upload some files to get started!
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <DataTablePagination
          table={table}
          deleteDocumentAction={deleteDocumentAction}
        />
      </div>
    </>
  );
}
