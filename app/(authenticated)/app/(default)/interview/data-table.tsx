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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useCountdown } from "@/lib/hooks";
import { formatTime } from "@/lib/utils";

import { DataTableViewOptions } from "@/components/internals/data-table-view-options";
import { DataTablePagination } from "@/components/internals/data-table-pagination";
import { DocumentItemIncluded } from "@/prisma/db/document";
import { SessionItemIncluded } from "@/prisma/db/session";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  action?: (data: DocumentItemIncluded[]) => void;
}

const endTime = 5 * 60 * 1000; // 5 minutes in milliseconds

export function DataTable<TData, TValue>({
  columns,
  data,
  action,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const timeLeft = useCountdown(openDialog, endTime, {
    interval: 1000,
    onTick: () => console.log("tick"),
    onComplete: () => setOpenDialog(false),
  });

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
                      <AlertDialog
                        open={openDialog}
                        onOpenChange={setOpenDialog}
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant={"default"} size={"sm"}>
                            Launch
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              <div className="flex gap-4 justify-between mb-8">
                                Launching Interview Copilot
                                <h1 className="text-5xl font-bold">
                                  {formatTime(timeLeft)}
                                </h1>
                              </div>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              You are about to start an Interview Copilot
                              session. If you wish to start, please click{" "}
                              <strong>continue</strong>, or click{" "}
                              <strong>cancel</strong> / <strong>wait</strong>{" "}
                              for timer to expired to cancel session without
                              consuming credit.
                              <div className="flex flex-col gap-4 mt-4">
                                Please review the details below:
                                <ul className="list-disc ml-4">
                                  <li>Session: 25 Credits</li>
                                  <li>Time Limit: 60 Minutes</li>
                                </ul>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setOpenDialog(false)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const org = row.original as SessionItemIncluded;
                                router.push(`/app/session/${org?.id}`);
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

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
