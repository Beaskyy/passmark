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

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };
  const validateConfirmPassword = (value: string) => {
    if (!value) return "Confirm password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (value !== password) return "Passwords don't match";
    return "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword);
    if (passwordErr || confirmPasswordErr) {
      setPasswordError(passwordErr);
      setConfirmPasswordError(confirmPasswordErr);
      return;
    }
    toast.success("Password reset successfully");
    setTimeout(() => {
      router.replace("/login");
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 z-10 bg-white lg:w-[448px] w-[280px] lg:p-8 p-6 rounded-[16px] shadow-[0px_4px_6px_-4px_#121A2B1A]"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                  <h4 className="lg:text-xl text-base text-[#111827] font-semibold tracking-[-1%]">
                    Set password
                  </h4>
                  <p className="lg:text-base text-xs text-[#8E8E8E]">
                    Set your account’s password
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <Eye className="size-[18px] text-[#8F8F8F]" />
                        ) : (
                          <EyeClosed className="size-[18px] text-[#8F8F8F]" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500">{passwordError}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <Eye className="size-[18px] text-[#8F8F8F]" />
                        ) : (
                          <EyeClosed className="size-[18px] text-[#8F8F8F]" />
                        )}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-sm text-red-500">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Button type="submit" className="rounded-full font-geist" disabled={loading}>
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

export default ResetPassword;
