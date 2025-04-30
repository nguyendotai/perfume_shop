import React, { useEffect, useState } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaChevronDown, FaSearch } from "react-icons/fa";

// Định nghĩa kiểu dữ liệu cho userInfo
interface UserInfo {
  id: number;
  ho_ten: string;
  email: string;
  anh_dai_dien?: string;
}

const Nav: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    if (token) {
      fetch("http://localhost:3000/api/user-info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.error) {
            console.error(data.error);
          } else {
            setUserInfo(data); // Lưu thông tin người dùng vào state
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        });
    }
  }, []);

  return (
    <div className="fixed top-0 left-[15%] w-[85%] z-50 bg-white shadow-md p-4 flex justify-between items-center">
      {/* Search */}
      <div className="relative w-1/3 max-w-md ml-20">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full text-gray-800 placeholder-gray-400 pl-10 pr-4 py-2 rounded-xl shadow-inner bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00cc99] focus:border-[#00cc99] transition"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
  
      {/* User Section */}
      <div className="flex items-center space-x-6">
        <FaRegMessage className="text-xl text-gray-600 cursor-pointer hover:text-blue-500 transition" />
        <IoIosNotificationsOutline className="text-2xl text-gray-600 cursor-pointer hover:text-blue-500 transition" />
  
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
          {/* anh_dai_dien */}
          <img
            src={`http://localhost:3000/uploads/avatars/${userInfo?.anh_dai_dien}`}
            alt="User anh_dai_dien"
            className="w-10 h-10 rounded-full object-cover"
          />
  
          {/* Thông tin người dùng */}
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-800">
              {userInfo ? userInfo.ho_ten : "Loading..."}
            </span>
            <span className="text-xs text-gray-500">
              {userInfo ? userInfo.email : "Loading..."}
            </span>
          </div>
  
          {/* Icon mũi tên */}
          <FaChevronDown className="text-gray-500" size={14} />
        </div>
      </div>
    </div>
  );
  
};

export default Nav;
