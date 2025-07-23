import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type OrganisationCreditBalance = {
  organisation_id: string;
  organisation_name: string;
  current_balance: string;
  total_spent_credits: string;
  total_earned_credits: string;
  last_updated: string;
};

const getOrganisationCreditBalance = async (
  token: string,
  organisationId: string
): Promise<OrganisationCreditBalance> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/organisation/${organisationId}/balance/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch organisation credit balance");
  }
  const result = await response.json();
  return result.data;
};

export const useFetchOrganisationCreditBalance = () => {
  const { data: session, status } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const organisationId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["organisationCreditBalance", organisationId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!organisationId) throw new Error("No organisation ID");
      return getOrganisationCreditBalance(token, organisationId);
    },
    enabled: status !== "loading" && !!token && !!organisationId,
  });
};
