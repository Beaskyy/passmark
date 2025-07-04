import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type DeleteScriptPayload = {
  script_id: string;
};

const deleteScript = async (token: string, payload: DeleteScriptPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/delete/`,
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
    throw new Error(errorData.message || "Failed to delete script");
  }
  return response.json();
};

export const useDeleteScript = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: async (payload: DeleteScriptPayload) => {
      if (!token) throw new Error("No access token");
      return deleteScript(token, payload);
    },
  });
};
