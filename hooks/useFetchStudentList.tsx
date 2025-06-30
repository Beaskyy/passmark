"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type Student = {
  student_id: string;
  course_id: string;
  student_number: string;
  full_name: string;
  // Add other fields as needed
};

const fetchStudentList = async (
  token: string,
  organisationId: string
): Promise<Student[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/student/list/${organisationId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  const result = await response.json();
  return result.data; // Adjust if your backend wraps the list differently
};

export const useFetchStudentList = (organisationId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["studentList", organisationId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!organisationId) throw new Error("No organisation ID");
      return fetchStudentList(token, organisationId);
    },
    enabled: !!token && !!organisationId,
  });
};
