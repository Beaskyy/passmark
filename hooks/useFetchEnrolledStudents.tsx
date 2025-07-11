"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type EnrolledStudent = {
  student_id: string;
  course_id: string;
  student_number: string;
  full_name: string;
  created_at: string; 
};

const fetchEnrolledStudents = async (
  token: string,
  courseId: string
): Promise<EnrolledStudent[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/student/enroll/list/${courseId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch enrolled students");
  }
  const result = await response.json();
  return result.data; // Adjust if your backend wraps the list differently
};

export const useFetchEnrolledStudents = (courseId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["enrolledStudents", courseId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!courseId) throw new Error("No course ID");
      return fetchEnrolledStudents(token, courseId);
    },
    enabled: !!token && !!courseId,
  });
};
