"use client";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ellipsis,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  tableName: string;
  getId: (row: TData) => string | number;
  onRowClick?: (row: TData) => void;
  meta?: any; // Allow passing meta for table.options.meta
  showStatusFilter?: boolean; // New prop
  showDeleteStudent?: boolean; // New prop
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  tableName,
  getId,
  onRowClick,
  meta,
  showStatusFilter = true, // Default true
  showDeleteStudent = false, // Default false
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleExport = () => {
    // Get the filtered data
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);

    // Convert data to CSV
    const headers = columns
      .filter((column) => column.id !== "select" && column.id !== "actions")
      .map((column) => {
        if (typeof column.header === "string") return column.header;
        if (typeof column.header === "function") return column.id;
        return column.id;
      });

    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) => {
        return columns
          .filter((column) => column.id !== "select" && column.id !== "actions")
          .map((column) => {
            const value = row[column.id as keyof typeof row];
            // Handle special cases like status or dates
            if (typeof value === "object" && value !== null) {
              return JSON.stringify(value);
            }
            return value;
          })
          .join(",");
      }),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${tableName.toLowerCase().replace(/\s+/g, "_")}_export.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta, // Pass meta to table instance
  });

  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <div className="w-full mb-6">
      <div className="">
        <div className="flex flex-col lg:flex-row justify-between items-start py-4">
          <h4 className="md:text-[17px] text-sm text-[#101828] md:font-semibold font-medium leading-9">
            {tableName}
          </h4>
          <div className="flex lg:flex-row flex-col lg:items-center gap-[13px] w-full lg:w-auto">
            <div className="flex items-center gap-[13px]">
              {showStatusFilter && (
                <Select
                  value={
                    (table.getColumn("status")?.getFilterValue() as string) ??
                    ""
                  }
                  onValueChange={(value) => {
                    table
                      .getColumn("status")
                      ?.setFilterValue(value === "all" ? "" : value);
                  }}
                >
                  <SelectTrigger className="min-w-[111px] w-full border border-[#EBEBEB] shadow-sm text-sm text-[#5C5C5C] h-9 rounded-[10px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <div
                className="flex items-center gap-1 shadow-sm min-w-[96px] w-full h-9 rounded-[10px] border border-[#EBEBEB] py-2 px-2.5 bg-white cursor-pointer hover:opacity-85"
                onClick={handleExport}
              >
                <Image
                  src="/images/share-forward.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
                <p className="text-sm text-[#5C5C5C] font-medium">Export</p>
              </div>
            </div>
            <div className="relative flex justify-center items-center w-full lg:min-w-[171px]">
              <Input
                placeholder="Search"
                value={
                  (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="max-h-9 placeholder:text-[#5C5C5C] !placeholder:lg:text-base placeholder:lg:text-sm p-2 w-full h-9 border border-[#EBEBEB] rounded-[10px] bg-white"
              />
              <Search className="absolute right-2 top-2 text-[#5C5C5C] size-5 cursor-pointer" />
            </div>
            {showDeleteStudent && (
              <div className="flex items-center gap-1 shadow-sm min-w-[96px] w-full h-9 rounded-[10px] border border-[#EBEBEB] py-2 px-2.5 bg-white cursor-pointer hover:opacity-85">
                <Trash2 className="size-5 text-[#5C5C5C]" />
                <p className="text-sm text-[#5C5C5C] font-medium">
                  Delete Student
                </p>
              </div>
            )}
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-sm text-[#5C5C5C] font-medium tracking-[-0.6%] leading-[20.3px] bg-[#FAFAFA] whitespace-nowrap"
                    >
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
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="first:font-medium text-sm text-[#171717] font-normal leading-[20px] h-[64px]"
                    >
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="px-[22px] py-3 rounded-[20px] bg-white">
          <div className="flex justify-between items-center gap-8">
            <p className="lg:block hidden text-[#5C5C5C] lg:text-sm text-xs whitespace-nowrap">
              Page {pageIndex + 1} of {table.getPageCount()}
            </p>
            <Pagination>
              <div className="flex justify-center items-center border border-[#EBEBEB] rounded-lg w-fit h-8 text-[#5C5C5C]">
                <div
                  className={`flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 ${
                    table.getCanPreviousPage()
                      ? "cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    table.getCanPreviousPage() && table.setPageIndex(0)
                  }
                >
                  <ChevronsLeft className="size-5" />
                </div>
                <div
                  className={`flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 ${
                    table.getCanPreviousPage()
                      ? "cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    table.getCanPreviousPage() && table.previousPage()
                  }
                >
                  <ChevronLeft className="size-5" />
                </div>
                {(() => {
                  const totalPages = table.getPageCount();
                  const currentPage = pageIndex + 1;
                  const pages = [];

                  // Always show first page
                  pages.push(
                    <div
                      key={1}
                      className={`flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 lg:text-sm text-xs font-medium cursor-pointer ${
                        currentPage === 1 ? "bg-[#F7F7F7] border-y" : ""
                      }`}
                      onClick={() => table.setPageIndex(0)}
                    >
                      1
                    </div>
                  );

                  // Calculate range around current page
                  let startPage = Math.max(2, currentPage - 1);
                  let endPage = Math.min(totalPages - 1, currentPage + 1);

                  // Add ellipsis after first page if needed
                  if (startPage > 2) {
                    pages.push(
                      <div
                        key="ellipsis1"
                        className="flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 lg:text-sm text-xs font-medium"
                      >
                        <Ellipsis className="size-5" />
                      </div>
                    );
                  }

                  // Add middle pages
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <div
                        key={i}
                        className={`flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 lg:text-sm text-xs font-medium cursor-pointer ${
                          currentPage === i ? "bg-[#F7F7F7] border-y" : ""
                        }`}
                        onClick={() => table.setPageIndex(i - 1)}
                      >
                        {i}
                      </div>
                    );
                  }

                  // Add ellipsis before last page if needed
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <div
                        key="ellipsis2"
                        className="flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 lg:text-sm text-xs font-medium"
                      >
                        <Ellipsis className="size-5" />
                      </div>
                    );
                  }

                  // Always show last page if there is more than one page
                  if (totalPages > 1) {
                    pages.push(
                      <div
                        key={totalPages}
                        className={`flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 lg:text-sm text-xs font-medium cursor-pointer ${
                          currentPage === totalPages
                            ? "bg-[#F7F7F7] border-y"
                            : ""
                        }`}
                        onClick={() => table.setPageIndex(totalPages - 1)}
                      >
                        {totalPages}
                      </div>
                    );
                  }

                  return pages;
                })()}
                <div
                  className={`flex justify-center items-center border-r border-[#EBEBEB] h-8 w-10 ${
                    table.getCanNextPage()
                      ? "cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => table.getCanNextPage() && table.nextPage()}
                >
                  <ChevronRight className="size-5 w-10" />
                </div>
                <div
                  className={`flex justify-center items-center h-8 w-10 ${
                    table.getCanNextPage()
                      ? "cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    table.getCanNextPage() &&
                    table.setPageIndex(table.getPageCount() - 1)
                  }
                >
                  <ChevronsRight className="size-5 w-10" />
                </div>
              </div>
            </Pagination>
            <div className="lg:flex hidden justify-center items-center whitespace-nowrap w-[57px] h-8 rounded-lg py-1.5 px-2.5 border border-[#EBEBEB] shadow-sm lg:text-sm text-xs font-medium tracking-[-0.09px]">
              {pageIndex + 1} / {table.getPageCount()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
