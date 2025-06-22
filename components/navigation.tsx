"use client";

import { useMedia } from "react-use";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "./ui/button";
import { LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { links } from "@/lib/data";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const isMobile = useMedia("(max-width: 1024px)", false);

  const handleClick = (name: string) => {
    setActiveLink(name);
    setIsOpen(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-6 text-[#007BFF]" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col justify-between h-screen"
        >
          <div>
            <div>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </div>
            <nav className="flex flex-col gap-y-2 pt-6">
              <div className="flex flex-col gap-1 text-sm font-medium">
                {links.map((link) => (
                  <Link
                    onClick={() => setIsOpen(false)}
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
            </nav>
          </div>
          <div
            className="flex flex-col gap-y-2"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-x-2 text-sm text-[#333333]">
              <User size={14} />
              <Link href={"/profile"}>Profile</Link>
            </div>
            <div className="flex items-center gap-x-2 text-[#F11B1B] text-sm">
              <LogOut size={14} />
              <Link href={"/login"} onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return null;
};
