import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type AcceptScriptPayload = {
  script_id: string;
};

const acceptScript = async (token: string, payload: AcceptScriptPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/accept/`,
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
    throw new Error(errorData.message || "Failed to accept script");
  }
  return response.json();
};

export const useAcceptScript = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: async (payload: AcceptScriptPayload) => {
      if (!token) throw new Error("No access token");
      return acceptScript(token, payload);
    },
  });
};
