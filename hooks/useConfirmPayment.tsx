import { useMutation } from "@tanstack/react-query";

export type ConfirmPaymentPayload = {
  tx_ref: string;
  organisation_id: string;
};

export type ConfirmPaymentResponse = {
  tx_ref: string;
  organisation_id: string;
};

const confirmPayment = async (
  payload: ConfirmPaymentPayload
): Promise<ConfirmPaymentResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/payment-confirm/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  return useMutation({
    mutationFn: confirmPayment,
  });
};
