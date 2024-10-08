import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ExitModal } from "@/components/modals/exit-modal";
import "./globals.css";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import Script from "next/script";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sololingo",
  description: "Developed by Jay Patel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">

        <body className={font.className}>
          <Toaster />
          <ExitModal />
          <HeartsModal />
          <PracticeModal/>
          {children}
        </body>
      </html>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"/>
    </ClerkProvider>
  );
}
