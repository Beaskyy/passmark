"use client";

import Image from "next/image";
// import { PaymentsColumn } from \"./columns\"; // Remove this import

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import { MarkedScript } from "../../../lib/data"; // Corrected import path

// Remove the local type definition
// type MarkedScript = {
//   scriptUploaded: string;
//   studentId: number;
//   courseCode: string;
//   dateMarked: string;
//   status: 'Approved' | 'Pending';
//   actions: string[];
// };

interface CellActionProps {
  data: MarkedScript; // Use the imported type
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();

  const handleActionClick = (action: string) => {
    // Implement logic based on the action
    console.log(`Action clicked: ${action} for script: ${data.scriptUploaded}`);
    // Example: Navigate to a view script page
    if (action === "View Script") {
      // router.push(`/scripts/${data.studentId}`); // Example navigation
    } else if (action === "Approve") {
      // Implement approve logic
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <span className="sr-only">Open menu</span>
            <Image src="/images/dots.svg" alt="dots" width={32} height={32} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {data.actions.map((action: string) => (
            <DropdownMenuItem
              key={action}
              onClick={() => handleActionClick(action)}
            >
              {action}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
