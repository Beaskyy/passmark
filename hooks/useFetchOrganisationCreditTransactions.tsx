import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type OrganisationCreditTransaction = {
  transaction_id: string;
  transaction_type: string;
  credit_amount: number;
  cash_amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
};

export type OrganisationCreditTransactionsResponse = {
  status: boolean;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  data: OrganisationCreditTransaction[];
};

const getOrganisationCreditTransactions = async (
  token: string,
  organisationId: string
): Promise<OrganisationCreditTransactionsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/organisation/${organisationId}/transactions/credits/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch organisation credit transactions");
  }
  return response.json();
};

export const useFetchOrganisationCreditTransactions = () => {
  const { data: session, status } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const organisationId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["organisationCreditTransactions", organisationId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!organisationId) throw new Error("No organisation ID");
      return getOrganisationCreditTransactions(token, organisationId);
    },
    enabled: status !== "loading" && !!token && !!organisationId,
  });
};
