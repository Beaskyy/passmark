import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type OrganisationPaymentTransaction = {
  transaction_id: string;
  amount: number;
  credits_purchased: number;
  payment_method: string;
  payment_status: string;
  external_payment_id: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  pricing_plan: string | null;
  virtual_account_number: string | null;
};

export type OrganisationPaymentTransactionsResponse = {
  status: boolean;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  data: OrganisationPaymentTransaction[];
};

const getOrganisationPaymentTransactions = async (
  token: string,
  organisationId: string
): Promise<OrganisationPaymentTransactionsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/organisation/${organisationId}/transactions/payments/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch organisation payment transactions");
  }
  return response.json();
};

export const useFetchOrganisationPaymentTransactions = () => {
  const { data: session, status } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const organisationId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["organisationPaymentTransactions", organisationId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!organisationId) throw new Error("No organisation ID");
      return getOrganisationPaymentTransactions(token, organisationId);
    },
    enabled: status !== "loading" && !!token && !!organisationId,
  });
};
