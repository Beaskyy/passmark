import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type DeleteCoursePayload = {
  course_id: string;
};

const deleteCourse = async (token: string, payload: DeleteCoursePayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/course/delete/`,
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
    throw new Error(errorData.message || "Failed to delete course");
  }
  return response.json();
};

export const useDeleteCourse = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: DeleteCoursePayload) => {
      if (!token) throw new Error("No access token");
      return deleteCourse(token, payload);
    },
  });
};
