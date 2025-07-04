"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MarkedScript } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";

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
            row.original?.scriptUploaded?.split(".")[1] === "pdf"
              ? "pdf"
              : row.original?.scriptUploaded?.split(".")[1] === "jpg"
              ? "jpg"
              : "png"
          }.svg`}
          alt="doc"
          width={32}
          height={32}
        />
        <div>
          <p className="font-medium">{row.original?.scriptUploaded}</p>
          <small className="text-xs text-[#5C5C5C]">2.4 MB</small>
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
  },
  {
    accessorKey: "studentScore",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-0.5 cursor-pointer"
        >
          Student&apos;s Score
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
          />
        </div>
      );
    },
    cell: ({ row }) => <span>{row.original?.studentScore} Points</span>,
  },
  {
    accessorKey: "dateMarked",
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
            row.original?.status?.toLocaleLowerCase() === "approved"
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
      <div className="flex gap-2">
        {row.original?.actions?.map((action: string, index: number) => (
          <div
            key={index}
            className="flex justify-center items-center border border-[#EBEBEB] bg-white w-fit h-8 shadow-sm px-3 rounded-lg"
          >
            <p className="text-[#5C5C5C] font-medium text-sm tracking-[0.6px] leading-5 whitespace-nowrap">
              {action}
            </p>
          </div>
        ))}
      </div>
    ),
  },
];
