"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RecoverPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address";
    return "";
  };
  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const emailErr = validateEmail(email);
    setEmailError(emailErr);
    if (!emailErr) {
      toast.success("Email sent successfully");
      setTimeout(() => {
        router.push("/otp-verification");
      }, 2000);
    }
    return;
  };

  return (
    <div className="container mx-auto max-w-[1440px] bg-[#F9FAFB] min-h-screen">
      <div className="flex flex-col">
        <Link href="/login" className="md:pt-[86px] pt-10">
          <Image src="/images/back.svg" alt="back" width={44} height={44} />
        </Link>
        <div className="flex flex-col justify-center items-center gap-4 pt-[95px]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(59.66%_49.84%_at_44.77%_47.75%,rgba(27,152,193,0.3)_0%,rgba(157,174,240,0.3)_100%)] rounded-full blur-3xl" />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 z-10 bg-white lg:w-[448px] w-[280px] lg:p-8 p-6 rounded-[16px] shadow-[0px_4px_6px_-4px_#121A2B1A]"
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="yourname@company.com"
                    className="w-full"
                    required
                  />
                  {emailError && (
                    <span className="text-red-500 text-xs mt-1">
                      {emailError}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="rounded-full font-geist"
                    disabled={loading}
                  >
                    Continue
                  </Button>
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
