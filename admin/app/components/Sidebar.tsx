import React from "react";
import { useRouter } from 'next/navigation';


const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token
    router.push("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="h-screen w-63.5">
      {/* Sidebar */}
      <aside className="h-screen text-gray-800 bg-white flex flex-col w-full shadow-md">
        <div className="w-full p-6.5 text-2xl font-bold border-b-4 border-[#00cc99] flex items-center justify-center space-x-2">
          <span className="text-[#00cc99]">Perfume Store</span>
          <div className="w-2 h-2 rounded-full bg-[#00cc99] animate-pulse"></div>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <a
            href="/"
            className="block px-4 py-3 rounded-lg hover:bg-[#e0f7f4] text-gray-700 hover:text-[#00cc99] transition duration-300 transform hover:scale-105"
          >
            Tổng quan
          </a>
          <a
            href="#"
            className="block px-4 py-3 rounded-lg hover:bg-[#e0f7f4] text-gray-700 hover:text-[#00cc99] transition duration-300 transform hover:scale-105"
          >
            Quản trị người dùng
          </a>
          <a
            href="/categories"
            className="block px-4 py-3 rounded-lg hover:bg-[#e0f7f4] text-gray-700 hover:text-[#00cc99] transition duration-300 transform hover:scale-105"
          >
            Quản trị danh mục
          </a>
          <a
            href="/products"
            className="block px-4 py-3 rounded-lg hover:bg-[#e0f7f4] text-gray-700 hover:text-[#00cc99] transition duration-300 transform hover:scale-105"
          >
            Quản trị sản phẩm
          </a>
          <a
            href="#"
            className="block px-4 py-3 rounded-lg hover:bg-[#e0f7f4] text-gray-700 hover:text-[#00cc99] transition duration-300 transform hover:scale-105"
          >
            Quản trị đơn hàng
          </a>
        </nav>
        <div className="p-4 border-t-4 border-[#00cc99]">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-400 transition duration-300"
          >
            Đăng xuất
          </button>
        </div>
      </aside>
    </div>
  );
  
};

export default Sidebar;
