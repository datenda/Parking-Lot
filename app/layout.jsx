"use client";
import "@/styles/globals.css";
import { useEffect } from "react";

import { usePathname, useSearchParams } from "next/navigation"; // Import useRouter hook
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

// Define the viewport object
const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (!isHomePage) {
        if (!storedToken) {
          router.push("/");
        }
      } else if (isHomePage && storedToken) {
        router.push("/parquimetro");
      }
    }
  }, [router]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ToastContainer
          toastClassName=" relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
          theme="dark"
          bodyClassName={() => "text-sm font-white font-med block p-3"}
          position="bottom-left"
          autoClose={3000}
        />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            {!isHomePage && <Navbar />}
            <main className="">{children}</main>
            <footer className="w-full flex items-center justify-center py-3"></footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
