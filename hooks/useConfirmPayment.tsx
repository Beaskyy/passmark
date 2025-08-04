import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type ConfirmPaymentPayload = {
  tx_ref: string;
  organisation_id: string;
};

export type ConfirmPaymentResponse = {
  tx_ref: string;
  organisation_id: string;
};

const confirmPayment = async (
  payload: ConfirmPaymentPayload,
  token: string
): Promise<ConfirmPaymentResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/payment-confirm/`,
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
    throw new Error("Failed to confirm payment");
  }
  return response.json();
};

export const useConfirmPayment = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: ConfirmPaymentPayload) => {
      if (!token) throw new Error("No access token");
      return confirmPayment(payload, token);
    },
  });
};
