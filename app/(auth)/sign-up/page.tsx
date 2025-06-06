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

const SignUp = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    // Simple email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address";
    return "";
  };
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
    if (currentStep === 1) {
      const emailErr = validateEmail(email);
      setEmailError(emailErr);
      if (!emailErr) {
        setCurrentStep(2);
        
      }
      return;
    }
    // Step 2: validate password and confirmPassword
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);
    if (!passwordErr && !confirmPasswordErr) {
      // Success: handle sign up
      // Redirect or clear form as needed
      console.log({ email, password, confirmPassword });
      toast.success("Account created successfully");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-[1440px] bg-[#F9FAFB] min-h-screen">
      <div className="flex lg:flex-row flex-col gap-12 justify-between items-center lg:pt-[169px] py-10 lg:px-[96px]">
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-4 lg:max-w-[528px]">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={169}
                height={40.48}
              />
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="lg:text-[48px] text-3xl text-[#111827] font-semibold tracking-[-1%] lg:leading-[60px] lg:max-w-[423px]">
                Let AI handle all the scripts
              </h1>
              <p className="lg:text-lg text-xs text-[#4B5563]">
                Save hours with AI-assisted script marking that&apos;s fast,
                fair, and accurate; so you can focus on what matters
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/avatar-stack.svg"
                alt="avatar-stack"
                width={108}
                height={36}
              />
              <p className="lg:text-sm text-xs text-[#4B5563] font-medium tracking-[-0.09px]">
                Over 5k+ happy users
              </p>
            </div>
          </div>
        </div>
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
                    {currentStep === 1 ? "Create account" : "Set password"}
                  </h4>
                  <p className="lg:text-base text-xs text-[#8E8E8E]">
                    {currentStep === 1
                      ? "Kindly enter your email address"
                      : "Set your account's password"}
                  </p>
                </div>
                {currentStep === 1 ? (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="yourname@company.com"
                      className="w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && (
                      <p className="text-sm text-red-500">{emailError}</p>
                    )}
                  </div>
                ) : (
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
                )}
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Button type="submit" className="rounded-full font-geist" disabled={loading}>
                    {currentStep === 1 ? "Continue" : "Create account"}
                  </Button>
                  {currentStep === 1 && (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="flex-1 border-[0.5px] border-[#F3F4F6]"></span>
                        <span className="text-sm text-[#4B5563] font-medium">
                          or
                        </span>
                        <span className="flex-1 border-[0.5px] border-[#F3F4F6]"></span>
                      </div>
                      <div className="grid grid-cols-3 lg:gap-3.5 gap-2">
                        <div className="flex items-center justify-center py-2.5 px-4 rounded-[22px] lg:h-11 h-8 border border-[#F2F2F2] cursor-pointer">
                          <Image
                            src="/images/google.svg"
                            alt="google"
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="flex items-center justify-center py-2.5 px-4 rounded-[22px] lg:h-11 h-8 border border-[#F2F2F2] cursor-pointer">
                          <Image
                            src="/images/apple.svg"
                            alt="apple"
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="flex items-center justify-center py-2.5 px-4 rounded-[22px] lg:h-11 h-8 border border-[#F2F2F2] cursor-pointer">
                          <Image
                            src="/images/microsoft.svg"
                            alt="microsoft"
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-center items-cener">
                  <p className="lg:text-sm text-xs text-[#4B5563] font-geist">
                    Already have an account{" "}
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

export default SignUp;
