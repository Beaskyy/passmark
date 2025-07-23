import { useQuery } from "@tanstack/react-query";

export type PaymentPlan = {
  pricing_id: string;
  name: string;
  description: string;
  credit: string;
  amount: string;
  is_active: boolean;
  created_at: string;
};

export type PaymentPlansResponse = {
  status: boolean;
  message: string;
  data: PaymentPlan[];
};

const getPaymentPlans = async (): Promise<PaymentPlansResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/pricing-plans/`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payment plans");
  }
  return response.json();
};

export const useFetchPaymentPlans = () => {
  return useQuery({
    queryKey: ["paymentPlans"],
    queryFn: getPaymentPlans,
  });
};
