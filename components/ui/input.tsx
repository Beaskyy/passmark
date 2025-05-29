import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex lg:h-11 h-9 w-full rounded-[10px] border border-[#F5F5F5] bg-background px-3 py-2.5 lg:text-sm text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#6B7280] lg:placeholder:text-base placeholder:text-xs placeholder:font-normal focus:outline-none focus:border-[#335CFF] disabled:cursor-not-allowed disabled:opacity-50 shadow-[0px_4px_6px_-4px_#121A2B1A]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
