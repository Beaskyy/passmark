import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type FilterOrganisationScriptPayload = {
  organisation_id: string;
  status: string;
};

const filterOrganisationScript = async (
  token: string,
  payload: FilterOrganisationScriptPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/filter/organisation/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to filter organisation scripts"
    );
  }
  return response.json();
};

export const useFilterOrganisationScript = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: async (payload: FilterOrganisationScriptPayload) => {
      if (!token) throw new Error("No access token");
      return filterOrganisationScript(token, payload);
    },
  });
};
