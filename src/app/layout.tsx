import type { Metadata, Viewport } from "next";
import "./globals.css";
import { initialState } from "recharts/types/state/rootPropsSlice";

export const metadata: Metadata = {
  title: "Open Orders Dashboard",
  description: "Historical open order depth and fill volume",
};

export const viewport: Viewport = {width:"device-width", initialScale: 1}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-3 sm:py-4">
          <header className="mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl font-semibold">Open Orders Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600">Buy/Sell depth lines • Fill volume bars</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
