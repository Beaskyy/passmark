"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type CreateBulkEnrollmentPayload = {
  organisation_id: string;
  course_id: string;
  students_csv: File; // Now a File, not a string
};

const createBulkEnrollment = async (
  token: string,
  payload: CreateBulkEnrollmentPayload
) => {
  const formData = new FormData();
  formData.append("organisation_id", payload.organisation_id);
  formData.append("course_id", payload.course_id);
  formData.append("students_csv", payload.students_csv);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/student/enroll/bulk-create/csv/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type' should NOT be set when using FormData
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create bulk enrollment");
  }

  return response.json();
};

export const useCreateBulkEnrollment = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (
      payload: Omit<CreateBulkEnrollmentPayload, "organisation_id"> & {
        organisation_id?: string;
      }
    ) => {
      if (!token) throw new Error("No access token");
      const finalPayload = {
        ...payload,
        organisation_id: payload.organisation_id || orgId,
      };
      if (!finalPayload.organisation_id) throw new Error("No organisation ID");
      return createBulkEnrollment(
        token,
        finalPayload as CreateBulkEnrollmentPayload
      );
    },
  });
};
