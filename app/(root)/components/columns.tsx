"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MarkedScript } from "@/lib/data";

export const columns: ColumnDef<MarkedScript>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center  !border-[#E1E4EA] rounded">
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="w-4 h-4 border border-[#E1E4EA] rounded cursor-pointer shadow-sm"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="flex items-center  !border-[#E1E4EA] rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4  !border-[#dd263b] rounded cursor-pointer"
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
        <Image src="/images/png.svg" alt="doc" width={32} height={32} />
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
          Student's ID
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
  },
];
