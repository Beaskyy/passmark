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
import { signIn } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

    if (currentStep === 1) {
      const emailErr = validateEmail(email);
      setEmailError(emailErr);
      if (!emailErr) {
        setCurrentStep(2);
      }
      return;
    }

    // Step 2: validate password and sign in
    const passwordErr = validatePassword(password);
    setPasswordError(passwordErr);
    if (!passwordErr) {
      setIsLoggingIn(true);
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid email or password");
        } else {
          toast.success("Login successful");
          router.push("/");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  return (
    <div className="container mx-auto max-w-[1440px] flex justify-center items-center bg-[#F9FAFB] min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <Image src="/images/logo.svg" alt="logo" width={132} height={40.48} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(59.66%_49.84%_at_44.77%_47.75%,rgba(27,152,193,0.3)_0%,rgba(157,174,240,0.3)_100%)] rounded-full blur-3xl" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2.5 z-10 bg-white lg:w-[448px] w-[280px] lg:p-8 p-6 rounded-[16px] shadow-[0px_4px_6px_-4px_#121A2B1A]"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-1">
                <h4 className="lg:text-xl text-base text-[#111827] font-semibold tracking-[-1%]">
                  Welcome back
                </h4>
                <p className="lg:text-base text-xs text-[#8E8E8E]">
                  {`
                      Kindly enter your ${
                        currentStep === 1 ? "email address" : "password"
                      } `}
                </p>
              </div>
              {currentStep === 1 ? (
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
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full pr-10"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        required
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
                      <span className="text-red-500 text-xs mt-1">
                        {passwordError}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="rounded-full"
                  disabled={isLoggingIn}
                >
                  Continue
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
                      <div
                        className="flex items-center justify-center py-2.5 px-4 rounded-[22px] lg:h-11 h-8 border border-[#F2F2F2] cursor-pointer"
                        onClick={() => signIn("google")}
                      >
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
                <p className="lg:text-sm text-xs text-[#4B5563]">
                  Don&apos;t have an account?{" "}
                  <span className="text-[#335CFF] font-semibold">
                    <Link href="/sign-up">Sign up</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
