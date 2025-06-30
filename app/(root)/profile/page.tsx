"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "@/providers/AccountProvider";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

const Profile = () => {
  const { user, isLoading } = useAccount();
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

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

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const currentPassErr = validatePassword(currentPassword);
    const newPassErr = validatePassword(password);
    const confirmNewPassErr = validateConfirmPassword(confirmPassword);

    setCurrentPasswordError(currentPassErr);
    setNewPasswordError(newPassErr);
    setConfirmNewPasswordError(confirmNewPassErr);

    if (!currentPassErr && !newPassErr && !confirmNewPassErr) {
      console.log("Passwords are valid, proceeding with update:", {
        currentPassword,
        newPassword: password,
        confirmPassword,
      });
      // Here you would typically make an API call to update the password
      // For now, it's just a console log.

      // Clear form fields and errors on successful validation (or API call success)
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setCurrentPasswordError("");
      setNewPasswordError("");
      setConfirmNewPasswordError("");
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      <div className="flex flex-col gap-[34px]">
        <div className="flex flex-col gap-3">
          <h4 className="text-black lg:text-[17px] text-sm font-semibold">
            My Profile
          </h4>
          <div className="flex lg:flex-row flex-col justify-between lg:items-center py-4 px-[22px] bg-[#F0F3FF] rounded-[10px] gap-4">
            <div className="flex items-center gap-[18px]">
              <Image
                src="/images/profile.svg"
                alt="profile"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <h5 className="text-[#171717] lg:text-base text-sm font-semibold">
                  {user?.firstname} {user?.lastname}
                </h5>
                <p className="text-[#737373] lg:text-sm text-xs">
                  {user?.email}
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-[13px] text-xs font-medium">
                Update Password
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-10 lg:w-[448px] w-full">
                <DialogHeader>
                  <DialogTitle className="text-[#111827] lg:text-xl text-balance font-semibold tracking-[-1%]">
                    Update password
                  </DialogTitle>
                  <DialogDescription>
                    update your account&apos;s password
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handlePasswordUpdate}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="************"
                        className="w-full pr-10"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                    {currentPasswordError && (
                      <p className="text-sm text-red-500">
                        {currentPasswordError}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="************"
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
                    {newPasswordError && (
                      <p className="text-sm text-red-500">{newPasswordError}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmNewPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="************"
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
                    {confirmNewPasswordError && (
                      <p className="text-sm text-red-500">
                        {confirmNewPasswordError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="h-11 rounded-[32px] font-medium"
                  >
                    Update Password
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-black lg:text-[17px] text-sm font-semibold">
            Overview
          </h4>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
            <div className="flex justify-between items-center bg-white shadow-sm p-[22px] rounded-[10px]">
              <div className="flex flex-col gap-2">
                <h4 className="text-black lg:text-base text-sm lg:font-bold font-semibold">
                  232,343
                </h4>
                <p className="text-[#939393] lg:text-base text-sm font-medium">
                  Total Scripts
                </p>
              </div>
              <Image
                src="/images/script.svg"
                alt="script"
                width={44}
                height={44}
              />
            </div>
            <div className="flex justify-between items-center bg-white shadow-sm p-[22px] rounded-[10px]">
              <div className="flex flex-col gap-2">
                <h4 className="text-black lg:text-base text-sm lg:font-bold font-semibold">
                  123
                </h4>
                <p className="text-[#939393] lg:text-base text-sm font-medium">
                  Pending Approvals
                </p>
              </div>
              <Image src="/images/file.svg" alt="file" width={44} height={44} />
            </div>
            <div className="flex justify-between items-center bg-white shadow-sm p-[22px] rounded-[10px]">
              <div className="flex flex-col gap-2">
                <h4 className="text-black lg:text-base text-sm lg:font-bold font-semibold">
                  1,345 Students
                </h4>
                <p className="text-[#939393] lg:text-base text-sm font-medium">
                  Total Students
                </p>
              </div>
              <Image
                src="/images/student.svg"
                alt="student"
                width={44}
                height={44}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-black lg:text-[17px] text-sm font-semibold">
            Need help?
          </h4>
          <div className="bg-white shadow-sm p-[14.7px] rounded-[8.4px]">
            <div className="flex flex-col gap-2">
              <p className="text-[#313131] lg:text-sm text-xs font-medium">
                Contact support
              </p>
              <div className="flex justify-between w-[269px]">
                <Image
                  src="/images/whatsapp.svg"
                  alt="whatsapp"
                  width={24}
                  height={24}
                />
                <Image
                  src="/images/twitter.svg"
                  alt="twitter"
                  width={24}
                  height={24}
                />
                <Image
                  src="/images/instagram.svg"
                  alt="instagram"
                  width={24}
                  height={24}
                />
                <Image
                  src="/images/linkedin.svg"
                  alt="linkedin"
                  width={24}
                  height={24}
                />
                <Image
                  src="/images/email.svg"
                  alt="email"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
