'use client';

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Nav from "./components/Nav";
import { useRouter } from "next/navigation"; // Dùng useRouter
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoginPage, setIsLoginPage] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Sử dụng useRouter để điều hướng khi cần

  useEffect(() => {
    if (pathname === "/login") {
      setIsLoginPage(true);
    } else {
      setIsLoginPage(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Kiểm tra nếu chưa đăng nhập và đang ở trang không phải login thì chuyển về login
    const token = localStorage.getItem("token");
    if (!token && !isLoginPage) {
      router.push("/login"); // Điều hướng về trang login nếu không có token
    }
  }, [router, isLoginPage]); // Re-render nếu có thay đổi

  return (
    <html lang="en">
      <body>
        {!isLoginPage ? (
          <div className="flex">
            <div className="h-screen fixed w-[15%] bg-gradient-to-b from-[#1a1a1a] to-[#333] shadow-lg">
              <Sidebar />
            </div>
            <div className="w-[85%] ml-[15%] bg-gray-200">
              <Nav />
              <div className="mt-20">
                {children}
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-[#00ffcc] to-[#003333] flex justify-center items-center">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}
