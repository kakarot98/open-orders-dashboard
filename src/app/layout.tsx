import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Orders Dashboard",
  description: "Historical open order depth and fill volume",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-4">
          <header className="mb-4">
            <h1 className="text-xl font-semibold">Open Orders Dashboard</h1>
            <p className="text-sm text-gray-600">Buy/Sell depth lines • Fill volume bars</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
