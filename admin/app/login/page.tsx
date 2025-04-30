'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gửi thông tin đăng nhập đến API
      const response = await fetch("http://localhost:3000/api/dangnhap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, mat_khau: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token);

        // Kiểm tra role trong token (giả sử role được lưu trong payload của token)
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        if (decodedToken.role === 0) {
          // Chuyển hướng đến trang admin
          router.push("/");
        } else {
          // Nếu role không phải 0, hiển thị thông báo lỗi
          setErrorMessage("Bạn không có quyền truy cập vào trang admin.");
        }
      } else {
        setErrorMessage(data.error || "Đăng nhập thất bại.");
      }
    } catch (error) {
      setErrorMessage("Lỗi khi kết nối với máy chủ.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-[500px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-black">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-black">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}    
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">
          Đăng nhập
        </button>
      </form>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
}
