import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "Operation SHRED — 12-Week Workout Tracker",
  description: "A 12-week workout tracker for total body transformation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg text-white antialiased min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
