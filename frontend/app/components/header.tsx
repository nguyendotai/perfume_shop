"use client";
import SearchBar from "./searchBar";
import Menu from "./menu";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import Image from "next/image"; // Import component Image của Next.js
import { logout } from "@/lib/authSlice"; // Import action logout
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.gia * item.quantity, 0);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = !!user;
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken'); // Xóa token khỏi local storage
    router.push('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  if (!mounted) return null; 

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="w-[1320px] mx-auto h-[90px] flex justify-between items-center">
        {/* header-left */}
        <div className="h-full flex justify-center w-[50%]">
          {/* logo */}
          <a href="/" className="h-full w-[20%]">
            <img src="/logo.png" alt="Logo" className="h-full" />
          </a>
          {/* menu */}
          <Menu />
        </div>

        {/* header-right */}
        <div className="w-[50%] flex gap-1 h-full justify-between items-center">
          {/* Thanh tìm kiếm */}
          <SearchBar />

          {/* Hiển thị thông tin người dùng hoặc nút đăng nhập */}
          {isLoggedIn && user ? (
            <div className="relative group w-[auto] flex items-center justify-end">
              <Link href="/profile" className="flex items-center gap-3 cursor-pointer">
                {user.anh_dai_dien && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={`http://localhost:3000/uploads/avatars/${user.anh_dai_dien}`} alt={user.ho_ten} layout="fill" objectFit="cover" />
                  </div>
                )}
                <span className="text-black-700 transition text-[14px] font-semibold hover:underline">
                  {user.ho_ten || user.email}
                </span>
              </Link>
              {/* Dropdown menu khi hover */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-300 shadow-md rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200 ease-out z-50">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Hồ sơ
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group w-[27%] ">
              {/* Nút đăng nhập / đăng ký */}
              <Link href="/users" className="absolute right-0.5 top-[-5px] text-black-700 transition text-[12px] font-bold">
                ĐĂNG NHẬP / ĐĂNG KÝ
              </Link>

              {/* Form đăng nhập (vẫn giữ nguyên) */}
              
            </div>
          )}

          {/* Giỏ hàng */}
          <div className="flex items-center justify-end space-x-3 text-gray-600 w-[23%]">
            {/* Icon túi mua hàng */}
            <Link href="/cart" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 8l1.5-3.5a2 2 0 0 1 1.79-1.25h5.42a2 2 0 0 1 1.79 1.25L18 8m0 0h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2m12 0v-.5a4 4 0 0 0-8 0V8"
                />
              </svg>
            </Link>

            {/* Số tiền & số sản phẩm */}
            <div>
              <p className="text-yellow-500 font-semibold text-[14px]">{totalPrice.toLocaleString()} ₫</p>
              <p className="text-gray-500 text-sm">{totalItems} items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}