import type { Metadata } from "next";
import { inter, geist } from "./fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "@/components/providers/provider";

export const metadata: Metadata = {
  title: "Passmark",
  description: "AI-assisted script marking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body>
        <Provider>{children}</Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
