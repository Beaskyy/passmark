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

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

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
        <div className="hidden lg:flex items-center lg:gap-4 gap-1">
          <Image
            src="/images/notification.svg"
            alt="notification"
            width={40}
            height={40}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center gap-1.5 h-10 pl-1 pr-2 border border-[#EBEBEB] rounded-[22px]">
              <div className="flex justify-center items-center gap-2">
                <div className="relative flex justify-center items-center w-8 h-8 rounded-full">
                  <Image
                    src={
                      session?.user?.image
                        ? session?.user?.image
                        : "/images/profile.svg"
                    }
                    alt="profile"
                    fill
                    className="absolute rounded-full object-contain"
                  />
                </div>
                <p className="text-sm font-medium tracking-[-0.6%]">
                  {session?.user?.name || "User"}
                </p>
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
