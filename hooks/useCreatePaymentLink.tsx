import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type CreatePaymentLinkPayload = {
  pricing_id: string;
  organisation_id: string;
  email: string;
};

export type CreatePaymentLinkResponse = {
  status: boolean;
  message: string;
  data: {
    payment_link: string;
    tx_ref: string;
  };
};

const createPaymentLink = async (
  token: string,
  payload: CreatePaymentLinkPayload
): Promise<CreatePaymentLinkResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/create-payment-link/`,
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
    throw new Error(errorData.message || "Failed to create payment link");
  }
  return response.json();
};

export const useCreatePaymentLink = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: CreatePaymentLinkPayload) => {
      if (!token) throw new Error("No access token");
      return createPaymentLink(token, payload);
    },
  });
};
