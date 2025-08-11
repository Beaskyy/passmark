import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type CreateScriptPayload = {
  organisation_id: string;
  assessment_id: string;
  scripts: Array<{
    script_url: string;
    script_name: string;
    script_type: string;
    script_size: string;
  }>;
  page_skip: number;
};

const createScript = async (token: string, payload: CreateScriptPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/create/`,
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
    throw new Error(errorData.message || "Failed to create script");
  }
  return response.json();
};

export const useCreateScript = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: async (
      payload: Omit<CreateScriptPayload, "organisation_id"> & {
        organisation_id?: string;
      }
    ) => {
      if (!token) throw new Error("No access token");
      const finalPayload = {
        ...payload,
        organisation_id: payload.organisation_id || orgId,
      };
      if (!finalPayload.organisation_id) throw new Error("No organisation ID");
      return createScript(token, finalPayload as CreateScriptPayload);
    },
  });
};
