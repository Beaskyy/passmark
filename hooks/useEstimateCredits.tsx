import { useMutation } from "@tanstack/react-query";

export type CreditEstimatePayload = {
  pages: number;
  questions: number;
  script_count: number;
};

export type CreditEstimateBreakdown = {
  pages: number;
  words: number;
  questions: number;
  time: number;
  tokens: number;
};

export type CreditEstimateResponse = {
  status: boolean;
  message: string;
  data: {
    estimated_credits: number;
    breakdown: CreditEstimateBreakdown;
  };
};

const estimateCredits = async (
  payload: CreditEstimatePayload
): Promise<CreditEstimateResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/estimate-credits/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to estimate credits");
  }
  return response.json();
};

export const useEstimateCredits = () => {
  return useMutation({
    mutationFn: estimateCredits,
  });
};
