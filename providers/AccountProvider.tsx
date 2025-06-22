"use client";

import { createContext, useContext, ReactNode } from "react";
import { useFetchAccountDetails } from "@/hooks/useFetchAccountDetails";

type Organisation = {
  org_id: string;
  name: string;
  org_type: string;
  created_at: string;
};

type User = {
  email_verified: boolean;
  email: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  organisation: Organisation | null;
};

type AccountContextType = {
  user: User | undefined;
  isLoading: boolean;
  isError: boolean;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useFetchAccountDetails();

  return (
    <AccountContext.Provider value={{ user, isLoading, isError }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
