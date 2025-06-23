"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type EditCoursePayload = {
  course_id: string;
  organisation_id: string;
  code: string;
  title: string;
  session: string;
  description?: string;
};

const editCourse = async (token: string, payload: EditCoursePayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/course/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update course");
  }

  return response.json();
};

export const useEditCourse = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: Omit<EditCoursePayload, "organisation_id">) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return editCourse(token, { ...payload, organisation_id: orgId });
    },
  });
};
