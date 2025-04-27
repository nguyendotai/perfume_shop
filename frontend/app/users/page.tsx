// components/AuthForm.tsx
"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/authSlice";
import { useRouter } from "next/navigation";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    ho_ten: string;
    email: string;
    anh_dai_dien: string | null;
    so_dien_thoai: string | null;
    dia_chi: string | null;
  };
  error?: string;
}

interface RegisterResponse {
  message: string;
  user: any; // Adjust type as needed
  error?: string;
}

interface FormData {
  email: string;
  mat_khau: string;
  ho_ten?: string;
  xac_nhan_mk?: string;
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    mat_khau: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLogin) {
      // Đăng nhập
      try {
        const response = await fetch("http://localhost:3000/api/dangnhap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            mat_khau: formData.mat_khau,
          }),
        });

        const result: LoginResponse = await response.json();
        if (response.ok && result.token && result.user) {
          setSuccess("Đăng nhập thành công!");
          localStorage.setItem('authToken', result.token);
          dispatch(loginSuccess({
            id: result.user.id,
            email: result.user.email,
            token: result.token,
            ho_ten: result.user.ho_ten,
            anh_dai_dien: result.user.anh_dai_dien,
            so_dien_thoai: result.user.so_dien_thoai,
            dia_chi: result.user.dia_chi,
          }));
          router.push('/');
        } else {
          setError(result.error || "Đăng nhập thất bại");
        }
      } catch (error) {
        setError("Lỗi kết nối với server");
      }
    } else {
      // Đăng ký
      if (formData.mat_khau !== formData.xac_nhan_mk) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/dangky", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            mat_khau: formData.mat_khau,
            ho_ten: formData.ho_ten,
          }),
        });

        const result: RegisterResponse = await response.json();
        if (response.ok) {
          setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
          setIsLogin(true);
        } else {
          setError(result.error || "Đăng ký thất bại");
        }
      } catch (error) {
        setError("Lỗi kết nối với server");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="w-full bg-black">
        <h1 className="text-white font-semibold text-[40px] text-center p-2">Tài khoản</h1>
      </div>

      <div className="w-[1000px] mx-auto flex justify-between items-start">
        <div className="w-1/2 border-r my-5">
          {isLogin ? (
            <div>
              <h2 className="font-semibold text-3xl my-8">Đăng nhập</h2>
              <form onSubmit={handleSubmit} className="space-y-4 w-[80%]">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                    Tên đăng nhập hoặc Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label htmlFor="mat_khau" className="block text-gray-700 font-medium mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="mat_khau"
                    name="mat_khau"
                    value={formData.mat_khau}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition duration-300"
                >
                  Đăng nhập
                </button>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember" className="mx-2">Ghi nhớ</label>
                  </div>
                  <a href="#" className="text-black hover:underline">Quên mật khẩu?</a>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-3xl my-8">Đăng ký</h2>
              <form onSubmit={handleSubmit} className="space-y-4 w-[80%]">
                <div>
                  <label htmlFor="ho_ten" className="block text-gray-700 font-medium mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="ho_ten"
                    name="ho_ten"
                    value={formData.ho_ten || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label htmlFor="mat_khau" className="block text-gray-700 font-medium mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="mat_khau"
                    name="mat_khau"
                    value={formData.mat_khau}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label htmlFor="xac_nhan_mk" className="block text-gray-700 font-medium mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    id="xac_nhan_mk"
                    name="xac_nhan_mk"
                    value={formData.xac_nhan_mk || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition duration-300"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="w-1/2 flex flex-col items-center text-center space-y-4 mt-5 self-start">
          <h1 className="font-semibold text-3xl">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          </h1>
          <p className="max-w-lg">
            {isLogin
              ? "Đăng ký ngay để theo dõi đơn hàng của bạn và nhận ưu đãi hấp dẫn."
              : "Hãy đăng nhập ngay để tiếp tục mua sắm."}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-5 w-full max-w-md bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition duration-300"
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </div>
  );
}