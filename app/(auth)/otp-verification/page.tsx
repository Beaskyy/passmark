"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import VerificationInput from "react-verification-input";

const OtpVerification = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  const handleComplete = async (value: string) => {
    setLoading(true);
    console.log(value);
    toast.success("OTP verified successfully");
    setTimeout(() => {
      router.replace("/reset-password");
    }, 2000);
  };

  return (
    <div className="container mx-auto max-w-[1440px] bg-[#F9FAFB] min-h-screen">
      <div className="flex flex-col">
        <Link href="/recover-password" className="md:pt-[86px] pt-10">
          <Image src="/images/back.svg" alt="back" width={44} height={44} />
        </Link>
        <div className="flex flex-col justify-center items-center gap-4 pt-[95px]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(59.66%_49.84%_at_44.77%_47.75%,rgba(27,152,193,0.3)_0%,rgba(157,174,240,0.3)_100%)] rounded-full blur-3xl" />
          <div className="flex flex-col gap-2.5 z-10 bg-white lg:w-[478px] w-[280px] lg:p-8 p-6 rounded-[16px] shadow-[0px_4px_6px_-4px_#121A2B1A]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                  <h4 className="lg:text-xl text-base text-[#111827] font-semibold tracking-[-1%]">
                    Recover password
                  </h4>
                  <p className="lg:text-base text-xs text-[#8E8E8E]">
                    Kindly enter the code sent to your email address
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[#374151] font-geist">OTP Code</Label>
                  <VerificationInput
                    onComplete={() => setLoading(false)}
                    value={value}
                    onChange={(value) => setValue(value)}
                    length={6}
                    classNames={{
                      character:
                        "flex justify-center items-center md:h-[52px] h-7 md:min-w-[62.8px] max-w-8 border border-[#F0F0F0] md:rounded-[32px] rounded-[16px] md:text-[20px] text-xs text-[#181415] font-normal",
                      characterInactive: "bg-white",
                      characterSelected: "bg-white text-[#171717]",
                      characterFilled: "bg-white text-[#171717]",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Button className="rounded-full font-geist" onClick={() => handleComplete(value)} disabled={loading}>
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
