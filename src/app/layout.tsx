import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusPulse – Pomodoro timer & tasks",
  description: "Stay focused with a Pomodoro timer and simple task list."
};

export default function RootLayout({
  children
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased">
        {children}
      </body>
    </html>
  );
}
