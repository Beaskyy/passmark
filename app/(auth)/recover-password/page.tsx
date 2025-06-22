"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const RecoverPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address";
    return "";
  };

  const { mutate: sendOTP, isPending: isSendingOTP } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/send-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      return response.json();
    },
    onSuccess: () => {
      sessionStorage.setItem("recoveryEmail", email);
      toast.success("OTP sent successfully");
      router.push("/otp-verification");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    setEmailError(emailErr);

    if (!emailErr) {
      sendOTP({ email });
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[#F9FAFB]">
      <div className="w-full max-w-[1440px] flex flex-col items-center">
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
                    Recover password
                  </h4>
                  <p className="lg:text-base text-xs text-[#8E8E8E]">
                    Kindly enter your email address
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    placeholder="yourname@company.com"
                    className="w-full"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={isSendingOTP}
                  >
                    {isSendingOTP ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
                <div className="flex justify-center items-cener">
                  <p className="lg:text-sm text-xs text-[#4B5563]">
                    Remember your password?{" "}
                    <span className="text-[#335CFF] font-semibold">
                      <Link href="/login">Sign in</Link>
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

export default RecoverPassword;
