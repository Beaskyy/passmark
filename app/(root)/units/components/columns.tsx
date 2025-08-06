"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { UnitHistory } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

// Helper to format date
export function formatDate(dateString: string | null | undefined) {
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

export const columns: ColumnDef<UnitHistory>[] = [
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
    accessorKey: "units",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-0.5 cursor-pointer"
      >
        Units
        <Image
          src="/images/up-down-fill.svg"
          alt="up-down-fill"
          width={20}
          height={20}
        />
      </div>
    ),
    cell: ({ row }) => <span>{row.original.units}</span>,
  },
  {
    accessorKey: "amountPaid",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-0.5 cursor-pointer"
      >
        Amount Paid
        <Image
          src="/images/up-down-fill.svg"
          alt="up-down-fill"
          width={20}
          height={20}
        />
      </div>
    ),
    cell: ({ row }) => <span>{row.original.amountPaid}</span>,
  },
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-0.5 cursor-pointer"
      >
        Transaction Date
        <Image
          src="/images/up-down-fill.svg"
          alt="up-down-fill"
          width={20}
          height={20}
        />
      </div>
    ),
    cell: ({ row }) => <span>{row.original.transactionDate}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
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
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusKey = status.toLowerCase();
      return (
        <div className="flex items-center gap-1 border border-[#EBEBEB] bg-white w-fit h-6 p-1 pr-2 rounded-md whitespace-nowrap">
          <Image
            src={`/images/${
              statusKey === "success"
                ? "check"
                : statusKey === "pending"
                ? "alert"
                : statusKey === "in_queue"
                ? "in-queue"
                : "error"
            }.svg`}
            alt={statusKey}
            width={16}
            height={16}
          />
          <div>
            <p className="text-[#5C5C5C] font-medium text-xs capitalize">
              {statusKey}
            </p>
          </div>
        </div>
      );
    },
  },
];
