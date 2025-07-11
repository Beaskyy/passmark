"use client";

import { ColumnDef, RowData } from "@tanstack/react-table";
import Image from "next/image";
import { MarkedScript } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAcceptScript } from "@/hooks/useAcceptScript";
import { useQueryClient } from "@tanstack/react-query";

// Add TableMeta augmentation for onApprove

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onApprove?: (script_id: string) => void;
  }
} 

// Helper to format date
function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .replace(
      /(\d{2}:\d{2}) (AM|PM)/,
      (match, time, ampm) => `at ${time} ${ampm.toLowerCase()}`
    );
}

export const columns: ColumnDef<MarkedScript>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
          className="border-[#E1E4EA] data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-[#E1E4EA] data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm"
        />
      </div>
    ),
  },
  {
    accessorKey: "scriptUploaded",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-0.5 cursor-pointer"
        >
          Script Uploaded
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
          />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-0.5">
        <Image
          src={`/images/${
            row.original?.file_type === "pdf"
              ? "pdf"
              : row.original?.file_type === "jpg"
              ? "jpg"
              : "png"
          }.svg`}
          alt="doc"
          width={32}
          height={32}
        />
        <div>
          <p className="font-medium">{row.original?.file_name}</p>
          <small className="text-xs text-[#5C5C5C]">
            {(Number(row.original?.file_size) / 1024).toFixed(1)} KB
          </small>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-0.5 cursor-pointer"
        >
          Student&apos;s ID
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
          />
        </div>
      );
    },
    cell: ({ row }) => row.original?.student?.student_number,
  },
  {
    accessorKey: "courseCode",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-0.5 cursor-pointer"
        >
          Course Code
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
          />
        </div>
      );
    },
    cell: ({ row }) => row.original?.course?.code,
  },
  {
    accessorKey: "marked_at",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-0.5 cursor-pointer"
        >
          Date Marked
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
          />
        </div>
      );
    },
    cell: ({ row }) =>
      formatDate(row.original?.marked_at || row.original?.created_at),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-0.5 cursor-pointer"
        >
          Status
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
          />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-1 border border-[#EBEBEB] bg-white w-fit h-6 p-1 pr-2 rounded-md whitespace-nowrap">
        <Image
          src={`/images/${
            row.original?.status?.toLocaleLowerCase() === "completed"
              ? "check"
              : row.original?.status?.toLocaleLowerCase() === "pending"
              ? "alert"
              : "error"
          }.svg`}
          alt="check"
          width={16}
          height={16}
        />
        <div>
          <p className="text-[#5C5C5C] font-medium text-xs">
            {row.original?.status}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-0.5 cursor-pointer"
        >
          Actions
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
          />
        </div>
      );
    },
    cell: ({ row, table }) => {
      // Expect an onApprove handler to be passed via table.options.meta
      const onApprove = table.options.meta?.onApprove;
      const status = row.original?.status?.toLowerCase();
      const actions =
        status === "pending" ? ["View Script", "Approve"] : ["View Script"];
      return (
        <div className="flex gap-2">
          {actions.map((action: string, index: number) => {
            if (action === "Approve") {
              return (
                <div
                  key={index}
                  className="flex justify-center items-center border border-[#EBEBEB] bg-white w-fit h-8 shadow-sm px-3 rounded-lg cursor-pointer"
                  onClick={() => onApprove && onApprove(row.original.script_id)}
                >
                  <p className="text-[#5C5C5C] font-medium text-sm tracking-[0.6px] leading-5 whitespace-nowrap">
                    {action}
                  </p>
                </div>
              );
            }
            return (
              <div
                key={index}
                className="flex justify-center items-center border border-[#EBEBEB] bg-white w-fit h-8 shadow-sm px-3 rounded-lg cursor-pointer"
                onClick={() => {
                  if (action === "View Script") {
                    window.location.href = `/marked-scripts/${row.original.student_id}`;
                  }
                }}
              >
                <p className="text-[#5C5C5C] font-medium text-sm tracking-[0.6px] leading-5 whitespace-nowrap">
                  {action}
                </p>
              </div>
            );
          })}
        </div>
      );
    },
  },
];
