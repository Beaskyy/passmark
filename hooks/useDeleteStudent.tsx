"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type DeleteStudentPayload = {
  student_id: string;
};

const deleteStudent = async (token: string, payload: DeleteStudentPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/student/delete/`,
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
    throw new Error(errorData.message || "Failed to delete student");
  }

  return response.json();
};

export const useDeleteStudent = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: DeleteStudentPayload) => {
      if (!token) throw new Error("No access token");
      return deleteStudent(token, payload);
    },
  });
};
