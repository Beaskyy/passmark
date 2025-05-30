"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export const Header = () => {
  const pathname = usePathname();

  return (
    <div className="h-20 py-5 lg:px-[108px] md:px-[20] px-5 border-b border-[#EBEBEB]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Image src="/images/logo.png" alt="logo" width={40} height={40} />
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
            <DropdownMenuTrigger className="flex justify-center items-center gap-1.5 lg:h-10 h-9 py-2 pl-1 pr-2 border border-[#EBEBEB] rounded-[22px]">
              <div className="flex justify-center items-center gap-2">
                <Image
                  src="/images/profile.svg"
                  alt="profile"
                  width={32}
                  height={32}
                />
                <p className="text-sm font-medium tracking-[-0.6%]">Chris</p>
              </div>
              <Image
                src="/images/caret.svg"
                alt="caret"
                width={20}
                height={20}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[183px] py-3">
              <DropdownMenuLabel>
                <Link
                  href={"/profile"}
                  className="text-sm font-medium text-[#333333]"
                >
                  My Profile
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={"/login"}
                  className="text-sm font-medium text-[#F11B1B]"
                >
                  Log out
                </Link>
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
