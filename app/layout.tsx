import type { Metadata } from "next";
import { inter, geist } from "./fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "@/providers/provider";
import { SessionProvider } from "@/providers/SessionProvider";
import { AccountProvider } from "@/providers/AccountProvider";

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
        <SessionProvider>
          <Provider>
            <AccountProvider>{children}</AccountProvider>
          </Provider>
        </SessionProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
