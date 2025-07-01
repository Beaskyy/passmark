"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type CreateStudentPayload = {
  course_id: string;
  student: {
    student_number: string;
    full_name: string;
  };
};

const createStudent = async (
  token: string,
  orgId: string,
  payload: CreateStudentPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/student/enroll/create/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        organisation_id: orgId,
        course_id: payload.course_id,
        student: payload.student,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create student");
  }

  return response.json();
};

export const useCreateStudent = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return createStudent(token, orgId, payload);
    },
  });
};
