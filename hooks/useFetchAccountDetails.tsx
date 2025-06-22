import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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

const getAccountDetails = async (token: string): Promise<User> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/account/get-account/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch account details");
  }

  const result = await response.json();
  return result.data;
};

export const useFetchAccountDetails = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["accountDetails"],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      return getAccountDetails(token);
    },
    enabled: !!token,
  });
};
