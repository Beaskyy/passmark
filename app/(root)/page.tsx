"use client";

import UserHeader from "../../components/user-header";
import ActionCards from "../../components/action-cards";
import { DataTable } from "@/components/data-table";
import { markedScriptsData, MarkedScript } from "../../lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./components/cell-action";
import { PaymentsCellAction } from "./components/PaymentsCellAction";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type PaymentsColumn = {
  id: number;
  payment_id: string;
  amount: string;
  date: string;
  time: string;
  association: string;
  customer: string;
  created_at: string;
  status: string;
};

export default function Home() {
  const markedScriptsColumns: ColumnDef<MarkedScript>[] = [
    {
      accessorKey: "scriptUploaded",
      header: "Script Uploaded",
    },
    {
      accessorKey: "studentId",
      header: "Student's ID",
    },
    {
      accessorKey: "courseCode",
      header: "Course Code",
    },
    {
      accessorKey: "dateMarked",
      header: "Date Marked",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <CellAction data={row.original as MarkedScript} />,
    },
  ];

  const paymentsColumns: ColumnDef<PaymentsColumn>[] = [
    {
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 cursor-pointer"
          >
            CUSTOMER
            <ArrowUp className="text-[#707070] w-4 h-4" />
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 cursor-pointer"
          >
            Date
            <ArrowUp className="text-[#707070] w-4 h-4" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="w-28">{row.original.date}</span>
          <span className="text-xs font-normal">{row.original.time}</span>
        </div>
      ),
    },
    {
      accessorKey: "payment_id",
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 cursor-pointer w-28"
          >
            PAYMENT ID
            <ArrowUp className="text-[#707070] w-4 h-4" />
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 cursor-pointer w-28"
          >
            AMOUNT (₦)
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
            className="flex items-center gap-1 cursor-pointer"
          >
            Status
            <ArrowUp className="text-[#707070] w-4 h-4" />
          </div>
        );
      },
      cell: (info) => {
        const status = info.getValue() as string;
        const statusStyle =
          status === "completed"
            ? { color: "#039855", backgroundColor: "#ECFDF3" }
            : status === "pending"
            ? { color: "#DC6803", backgroundColor: "#FFFAEB" }
            : { color: "#D92D20", backgroundColor: "#FEF3F2" };

        return (
          <span
            style={statusStyle}
            className="flex justify-center items-center gap-2 py-1 pr-4 pl-3 rounded-[20px] text-sm font-medium w-fit"
          >
            {status === "completed" ? (
              <Image src="/images/dot.svg" alt="dot" width={8} height={8} />
            ) : status === "pending" ? (
              <Image
                src="/images/dot-warning.svg"
                alt="dot"
                width={8}
                height={8}
              />
            ) : (
              <Image
                src="/images/dot-danger.svg"
                alt="dot"
                width={8}
                height={8}
              />
            )}
            <span>{status}</span>
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: function PaymentsActionsCellRenderer({ row }) {
        return <PaymentsCellAction data={row.original} />;
      },
    },
  ];

  return (
    <main className="flex flex-col gap-5">
      <UserHeader />
      <ActionCards />
      <DataTable
        columns={markedScriptsColumns}
        data={markedScriptsData}
        searchKey="scriptUploaded"
        tableName="Recently marked scripts"
      />
    </main>
  );
}
