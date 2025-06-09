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
    cell: ({ row }) => (
      <div className="flex items-center gap-1 border border-[#EBEBEB] bg-white w-[88px] h-6 p-1 pr-2 rounded-md">
        <Image
          src={`/images/${
            row.original?.status?.toLocaleLowerCase() === "approved"
              ? "check"
              : "alert"
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
            <p className="text-[#5C5C5C] font-medium text-sm tracking-[-0.6px] leading-5 whitespace-nowrap">
              {action}
            </p>
          </div>
        ))}
      </div>
    ),
  },
];
