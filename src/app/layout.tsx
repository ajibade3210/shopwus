import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shopwus — Shop With Us | Digital Shop for Online Vendors & Businesses",
  description:
    "Shopwus (Shop With Us) is the platform to create a quick mini storefront, share interactive 3D business cards, broadcast messages, and track customers.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7fafe",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} bg-[#f7fafe]`}
      suppressHydrationWarning
    >
      <body className="antialiased font-sans bg-[#f7fafe] text-[#181c1f]" suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
