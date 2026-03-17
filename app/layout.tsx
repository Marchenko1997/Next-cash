import type { Metadata } from "next";
import Link from "next/link";
import { Poppins, Geist } from "next/font/google";
import { ChartColumnBigIcon } from "lucide-react";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,

} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/user-dropdown";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextCash",
  description: "Finance dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${poppins.variable} antialiased`}>
        <ClerkProvider>
          <nav className="bg-primary p-4 text-white h-20 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-2xl flex items-center gap-2"
            >
              <ChartColumnBigIcon className="text-lime-500" />
              NextCash
            </Link>

            <div className="flex gap-4 items-center">
              <Show when="signed-out">
                <Button asChild variant={"link"} className="text-white">
                  <SignInButton />
                </Button>
                <Button asChild variant={"link"} className="text-white">
                  <SignUpButton />
                </Button>
              </Show>

              <Show when="signed-in">
                <UserDropdown />
              </Show>
            </div>
          </nav>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
