"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PaymentsColumn } from "./columns"; // Import the PaymentsColumn type

interface PaymentsCellActionProps {
  data: PaymentsColumn; // Use the PaymentsColumn type
}

export const PaymentsCellAction: React.FC<PaymentsCellActionProps> = ({
  data,
}) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Image src="/images/dots.svg" alt="dots" width={32} height={32} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/payments/${data.id}`)}>
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
