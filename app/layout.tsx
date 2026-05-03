import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SafetyBanner from "@/app/components/SafetyBanner";
import StoryOverlay from "@/app/components/StoryOverlay";
import ModalManager from "@/app/components/ModalManager";

export const metadata: Metadata = {
  title: "Between the Lines – The Empathy Exchange",
  description: "A human-first space for lived experience. Real stories. Real people. Real circles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Handlee&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <StoryOverlay />
          <ModalManager />
          <Footer />
          <SafetyBanner />
        </Providers>
      </body>
    </html>
  );
}
