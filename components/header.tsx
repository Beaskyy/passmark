"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { links } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Navigation } from "./navigation";
import { signOut, useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";
import { Skeleton } from "./ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useState } from "react";
import { useFetchOrganisationCreditBalance } from "@/hooks/useFetchOrganisationCreditBalance";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { user, isLoading } = useAccount();
  const [showUnits, setShowUnits] = useState(false);
  const [showUnitPopover, setShowUnitPopover] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: creditBalance, isLoading: isCreditLoading } =
    useFetchOrganisationCreditBalance();

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      console.log("Logout successful, redirecting to login");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: force redirect to login
      router.push("/login");
    }
  };

  return (
    <div className="lg:h-20 h-16 lg:py-5 py-3 lg:px-[108px] md:px-[20] px-5 border-b border-[#EBEBEB]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href={"/"}>
            <Image
              src="/images/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="lg:size-10 size-7"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 px-3 rounded-lg font-medium ${
                  pathname === link.href
                    ? "bg-[#F7F7F7] text-[#171717]"
                    : "text-[#5C5C5C]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center lg:gap-4 gap-1">
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger className="hidden lg:flex cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="/images/notification.svg"
                alt="notification"
                width={40}
                height={40}
              />
            </PopoverTrigger>
            {showNotifications && (
              <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setShowNotifications(false)}
              />
            )}
            <PopoverContent
              className="w-full max-w-[402px] p-0 border-0 bg-white rounded-2xl z-50"
              style={{
                boxShadow: `
                  0px 48px 48px -24px #3333330A,
                  0px 24px 24px -12px #3333330A,
                  0px 12px 12px -6px #3333330A,
                  0px 6px 6px -3px #3333330A,
                  0px 3px 3px -1.5px #33333305,
                  0px 1px 1px 0.5px #3333330A,
                  0px 0px 0px 1px #3333330A,
                  0px -1px 1px -0.5px #3333330F inset
                `,
              }}
            >
              <div className="py-4 px-5 border-b border-[#EBEBEB]">
                <div className="flex justify-between items-center">
                  <h3 className="lg:text-base text-sm font-semibold text-[#171717]">
                    Notifications
                  </h3>
                  <button className="text-[#335CFF] lg:text-sm text-xs lg:font-medium font-normal hover:underline">
                    Mark all as read
                  </button>
                </div>
              </div>

              <div className="p-2 space-y-1">
                {/* Notification 1 */}
                <div className="flex items-start gap-1 p-3">
                  <div className="flex-1">
                    <p className="lg:text-sm text-xs text-[#3C3C3C] font-medium">
                      🎉Your script has been marked and is ready to view.
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-1">8 min ago</p>
                  </div>
                </div>

                {/* Notification 2 */}
                <div className="flex items-start gap-1 p-3">
                  <div className="flex-1">
                    <p className="lg:text-sm text-xs text-[#3C3C3C] font-medium">
                      📄 You have 20 scripts waiting in line. We’re on it!
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-1">2 hours ago</p>
                  </div>
                </div>

                {/* Notification 3 */}
                <div className="flex items-start gap-1 p-3">
                  <div className="flex-1">
                    <p className="lg:text-sm text-xs text-[#3C3C3C] font-medium">
                      🎉You have successfully purchased 50,000 Units
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={showUnitPopover} onOpenChange={setShowUnitPopover}>
            <PopoverTrigger className="flex justify-center items-center gap-1.5 md:h-10 h-8 pl-[9px] pr-3 py-1.5 border border-[#F6F6F6] rounded-[22px] bg-[#FBFBFB]">
              <div className="flex justify-center items-center gap-2">
                <Image
                  src="/images/coin.svg"
                  alt="profile"
                  width={22}
                  height={22}
                />
                <div className="text-sm font-medium tracking-[-0.6%]">
                  {isCreditLoading ? (
                    <Skeleton className="w-24 h-5" />
                  ) : (
                    <p
                      className={`text-[13px] font-bold tracking-[0.8px] uppercase ${
                        creditBalance?.current_balance &&
                        +creditBalance.current_balance < 0
                          ? "text-[#FB3748]"
                          : "text-[#006730]"
                      }`}
                    >
                      {creditBalance?.current_balance
                        ? `${Number(
                            creditBalance.current_balance
                          ).toLocaleString()} UNITS`
                        : "0 UNITS"}
                    </p>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[266px] py-3.5 flex flex-col justify-center items-center gap-3">
              <div className="flex flex-col items-center justify-center gap-1.5">
                <p className="text-xs text-[#A2A2A2]">My Unit Balance</p>
                <h6
                  className={`lg:text-[15px] text-sm font-bold ${
                    creditBalance?.current_balance &&
                    +creditBalance.current_balance < 0
                      ? "text-[#FB3748]"
                      : "text-[#006730]"
                  }`}
                >
                  {isCreditLoading ? (
                    <Skeleton className="w-24 h-5" />
                  ) : creditBalance?.current_balance ? (
                    `${Number(
                      creditBalance.current_balance
                    ).toLocaleString()} UNITS`
                  ) : (
                    "0 UNITS"
                  )}
                </h6>
              </div>
              {showUnits && (
                <div className="flex flex-col bg-[#FCFCFC] border border-[#FAFAFA] rounded-[10px] p-3 gap-3 w-full transition-all duration-1000">
                  <div className="flex justify-between items-center w-full">
                    <p className="lg:text-[13px] text-xs text-[#777777] font-medium tracking-[-0.06px]">
                      Total Units
                    </p>
                    <p className="lg:text-[13px] text-xs text-[#777777] font-semibold tracking-[2%] uppercase">
                      {Number(
                        creditBalance?.total_earned_credits
                      ).toLocaleString()}{" "}
                      UNITS
                    </p>
                  </div>
                  <div className="h-[1px] bg-[#F7F7F7]"></div>
                  <div className="flex justify-between items-center w-full">
                    <p className="lg:text-[13px] text-xs text-[#777777] font-medium tracking-[-0.06px]">
                      Used Units
                    </p>
                    <p className="lg:text-[13px] text-xs text-[#777777] font-semibold tracking-[2%] uppercase">
                      {Number(
                        creditBalance?.total_spent_credits
                      ).toLocaleString()}{" "}
                      UNITS
                    </p>
                  </div>
                </div>
              )}

              {showUnits ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-none lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium hover:bg-[#F0F3FF] hover:text-primary"
                    onClick={() => setShowUnits(false)}
                  >
                    Go Back
                  </Button>
                  <Button
                    onClick={() => {
                      setShowUnitPopover(false);
                      router.push("/units");
                    }}
                    className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-full cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
                  >
                    Unit History
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-none lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium hover:bg-[#F0F3FF] hover:text-primary"
                    type="button"
                    onClick={() => setShowUnits(true)}
                  >
                    More Details
                  </Button>
                  <Button
                    onClick={() => {
                      setShowUnitPopover(false);
                      router.push("/units");
                    }}
                    className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-full cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
                  >
                    Buy Units
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden lg:flex justify-center items-center gap-1.5 h-10 pl-1 pr-2 border border-[#EBEBEB] rounded-[22px]">
              <div className="flex justify-center items-center gap-2">
                <Image
                  src={
                    session?.user?.image
                      ? session?.user?.image
                      : "/images/profile.svg"
                  }
                  alt="profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="text-sm font-medium tracking-[-0.6%]">
                  {isLoading || !user ? (
                    <Skeleton className="w-10 h-5" />
                  ) : user.firstname && user.lastname ? (
                    `${user.firstname}`
                  ) : (
                    session?.user?.name || "User"
                  )}
                </div>
              </div>
              <Image
                src="/images/caret.svg"
                alt="caret"
                width={20}
                height={20}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[183px] py-3">
              <DropdownMenuLabel
                onClick={() => router.push("/profile")}
                className="cursor-pointer"
              >
                <span className="text-sm font-medium text-[#333333]">
                  My Profile
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <span className="text-sm font-medium text-[#F11B1B]">
                  Log out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="lg:hidden">
          <Navigation />
        </div>
      </div>
    </div>
  );
};
