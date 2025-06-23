"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Course = {
  title: string;
  code: string;
  session: string;
  description?: string;
  course_id: string;
  organisation_id: string;
};

const getCourseDetails = async (
  token: string,
  courseId: string
): Promise<Course> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/course/get/${courseId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch course details");
  }
  const result = await response.json();
  return result.data;
};

export const useFetchCourseDetails = (courseId: string) => {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      return getCourseDetails(token, courseId);
    },
    enabled: status !== "loading" && !!token && !!courseId,
  });
};
