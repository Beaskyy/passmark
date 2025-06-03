"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { PaymentsCellAction } from "./PaymentsCellAction";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// The columns array definition will be moved to app/(root)/page.tsx
// export const columns: ColumnDef<PaymentsColumn>[] = [...];
