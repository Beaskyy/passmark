"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type DeleteEnrollmentPayload = {
  organisation_id: string;
  course_id: string;
  student_id: string;
};

const deleteEnrollment = async (
  token: string,
  payload: DeleteEnrollmentPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/student/enroll/delete/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete enrollment");
  }

  return response.json();
};

export const useDeleteEnrollment = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: DeleteEnrollmentPayload) => {
      if (!token) throw new Error("No access token");
      return deleteEnrollment(token, payload);
    },
  });
};
