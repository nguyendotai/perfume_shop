"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store"; 

export default function CheckOut() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState({
    ho_ten: "",
    email: "",
    dia_chi: "",
    so_dien_thoai: "",
    phuong_thuc_thanh_toan: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await fetch("http://localhost:3000/api/user-info", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
        setOrderInfo((prev) => ({
          ...prev,
          ho_ten: data.ho_ten,
          email: data.email,
          dia_chi: data.dia_chi || '',
          so_dien_thoai: data.so_dien_thoai || '',
        }));
      } else {
        setError("Không thể lấy thông tin người dùng.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleOrderSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/donhang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userInfo.id,
          ngay_dat: new Date(),
          tong_tien: cart.reduce((total, item) => total + item.gia * item.quantity, 0),  // Adjust as needed
          phuong_thuc_thanh_toan: orderInfo.phuong_thuc_thanh_toan,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess("Đơn hàng đã được tạo thành công.");
      } else {
        setError(result.error || "Lỗi tạo đơn hàng.");
      }
    } catch (err) {
      setError("Lỗi kết nối với server.");
    }
  };

  return (
    <div className="w-[1320px] mx-auto py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">THÔNG TIN THANH TOÁN</h2>
        <form className="space-y-4">
          <input
            type="text"
            value={orderInfo.ho_ten}
            onChange={(e) => setOrderInfo({ ...orderInfo, ho_ten: e.target.value })}
            placeholder="Họ và Tên *"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            value={orderInfo.dia_chi}
            onChange={(e) => setOrderInfo({ ...orderInfo, dia_chi: e.target.value })}
            placeholder="Địa chỉ *"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            value={orderInfo.so_dien_thoai}
            onChange={(e) => setOrderInfo({ ...orderInfo, so_dien_thoai: e.target.value })}
            placeholder="Số điện thoại *"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            value={orderInfo.email}
            onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })}
            placeholder="Địa chỉ email *"
            className="w-full p-3 border rounded-lg"
          />
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-4">THÔNG TIN BỔ SUNG</h2>
        <textarea
          placeholder="Ghi chú về đơn hàng"
          className="w-full p-3 border rounded-lg"
        ></textarea>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">ĐƠN HÀNG CỦA BẠN</h2>
        <div className="border-b pb-4 mb-4">
        {cart.length === 0 ? (
            <p>Giỏ hàng của bạn đang trống.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <p className="font-medium">{item.ten_sp} × {item.quantity}</p>
                <p className="text-right text-red-500 font-semibold">
                  {(item.gia * item.quantity).toLocaleString()} ₫
                </p>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Tổng</span>
          <span className="text-red-500">
            {cart.reduce((total, item) => total + item.gia * item.quantity, 0).toLocaleString()} ₫
          </span>
        </div>
        <input
          type="text"
          placeholder="Nhập mã ưu đãi"
          className="w-full p-2 border rounded-lg mt-4"
        />
        <button className="w-full bg-black text-white py-2 mt-2 rounded-lg">
          ÁP DỤNG
        </button>

        {/* Phương thức thanh toán */}
        <div className="mt-6 space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              onChange={() => setOrderInfo({ ...orderInfo, phuong_thuc_thanh_toan: 'Chuyển khoản ngân hàng' })}
            />
            <span>Chuyển khoản ngân hàng</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              onChange={() => setOrderInfo({ ...orderInfo, phuong_thuc_thanh_toan: 'Thanh Toán Tiền Mặt' })}
            />
            <span>Thanh Toán Tiền Mặt</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              onChange={() => setOrderInfo({ ...orderInfo, phuong_thuc_thanh_toan: 'Ví MoMo' })}
            />
            <span>Thanh toán bằng Ví MoMo</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              onChange={() => setOrderInfo({ ...orderInfo, phuong_thuc_thanh_toan: 'ATM, VISA' })}
            />
            <span>Thanh Toán Trực Tuyến ATM, VISA</span>
          </label>
        </div>

        <button
          className="w-full bg-black text-white py-3 mt-6 rounded-lg text-lg font-semibold"
          onClick={handleOrderSubmit}
        >
          ĐẶT HÀNG
        </button>

        {success && <div className="text-green-500 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}
