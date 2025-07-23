import { useMutation } from "@tanstack/react-query";

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
  payload: CreatePaymentLinkPayload
): Promise<CreatePaymentLinkResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/create-payment-link/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create payment link");
  }
  return response.json();
};

export const useCreatePaymentLink = () => {
  return useMutation({
    mutationFn: createPaymentLink,
  });
};
