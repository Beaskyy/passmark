"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import VerificationInput from "react-verification-input";

const OTPVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("recoveryEmail");
    if (!storedEmail) {
      router.push("/recover-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const validateOTP = (value: string) => {
    if (!value) return "OTP is required";
    if (value.length !== 5) return "OTP must be 5 digits";
    if (!/^\d+$/.test(value)) return "OTP must contain only numbers";
    return "";
  };

  const { mutate: verifyOTP, isPending: isVerifyingOTP } = useMutation({
    mutationFn: async ({ otp }: { otp: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            forget: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to verify OTP");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("OTP verified successfully");
      router.push("/reset-password");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpErr = validateOTP(otp);
    setOtpError(otpErr);

    if (!otpErr) {
      verifyOTP({ otp });
    }
  };

  return (
    <div className="container mx-auto max-w-[1440px] bg-[#F9FAFB] min-h-screen">
      <div className="flex lg:flex-row flex-col gap-12 justify-center items-center lg:pt-[169px] py-10 lg:px-[96px]">
        <div className="flex flex-col gap-4">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(59.66%_49.84%_at_44.77%_47.75%,rgba(27,152,193,0.3)_0%,rgba(157,174,240,0.3)_100%)] rounded-full blur-3xl" />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 z-10 bg-white lg:w-[432px] w-[280px] lg:p-8 p-6 rounded-[16px] shadow-[0px_4px_6px_-4px_#121A2B1A]"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                  <h4 className="lg:text-xl text-base text-[#111827] font-semibold tracking-[-1%]">
                    Verify OTP
                  </h4>
                  <p className="lg:text-base text-xs text-[#8E8E8E]">
                    Enter the OTP sent to your email
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[#374151]">OTP Code</Label>
                  <VerificationInput
                    onComplete={(value) => {
                      setOtp(value);
                      // Auto-submit when complete
                      const otpErr = validateOTP(value);
                      setOtpError(otpErr);
                      if (!otpErr) {
                        verifyOTP({ otp: value });
                      }
                    }}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    length={5}
                    placeholder=""
                    validChars="0-9"
                    classNames={{
                      character:
                        "flex justify-center items-center md:h-[52px] h-7 md:min-w-[62.8px] max-w-8 border border-[#F0F0F0] md:rounded-[32px] rounded-[16px] md:text-[20px] text-xs text-[#181415] font-normal",
                      characterInactive: "bg-white",
                      characterSelected: "bg-white text-[#171717]",
                      characterFilled: "bg-white text-[#171717]",
                    }}
                  />
                  {otpError && (
                    <p className="text-sm text-red-500">{otpError}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={isVerifyingOTP}
                  >
                    {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
                <div className="flex justify-center items-cener">
                  <p className="lg:text-sm text-xs text-[#4B5563]">
                    Didn&apos;t receive the code?{" "}
                    <span className="text-[#335CFF] font-semibold">
                      <Link href="/recover-password">Resend</Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
