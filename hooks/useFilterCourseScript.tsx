import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type FilterCourseScriptPayload = {
  course_id: string;
  status: string;
};

const filterCourseScript = async (
  token: string,
  payload: FilterCourseScriptPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/filter/course/`,
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
    throw new Error(errorData.message || "Failed to filter course scripts");
  }
  return response.json();
};

export const useFilterCourseScript = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: async (payload: FilterCourseScriptPayload) => {
      if (!token) throw new Error("No access token");
      return filterCourseScript(token, payload);
    },
  });
};
