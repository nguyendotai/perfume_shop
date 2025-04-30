import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-100 text-gray-800 min-h-screen space-y-6">
      {/* Tổng quan */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Tổng doanh thu", value: "$216k", change: "+341$", color: "text-green-600" },
          { label: "Số hóa đơn", value: "2,221", change: "+121", color: "text-green-600" },
          { label: "Khách hàng", value: "1,423", change: "+91", color: "text-green-600" },
          { label: "Mức độ trung thành", value: "78%", change: "-1%", color: "text-red-600" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            <p className={`${item.color} text-sm mt-1`}>{item.change}</p>
          </div>
        ))}
      </div>
  
      {/* Doanh thu hàng tháng & Thông báo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
          <div className="flex items-end justify-between h-40">
            {[
              { tháng: "Th3", giá: 8000 },
              { tháng: "Th4", giá: 5000 },
              { tháng: "Th5", giá: 2000 },
              { tháng: "Th6", giá: 15000, active: true },
              { tháng: "Th7", giá: 7000 },
              { tháng: "Th8", giá: 6000 },
              { tháng: "Th9", giá: 4000 },
              { tháng: "Th10", giá: 3000 },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-6 rounded-md ${
                    item.active ? "bg-teal-400" : "bg-gray-300"
                  }`}
                  style={{ height: `${item.giá / 150}px` }}
                />
                <span className="text-xs mt-2 text-gray-500">{item.tháng}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-800 font-bold text-center mt-4">$15,000</p>
        </div>
  
        <div className="bg-gradient-to-br from-teal-300 to-teal-700 text-white p-6 rounded-xl flex flex-col justify-between">
          <div>
            <span className="bg-white text-teal-700 px-2 py-1 rounded-full text-xs font-semibold">
              MỚI
            </span>
            <h4 className="text-lg font-bold mt-4">Đã có mẫu hóa đơn mới!</h4>
            <p className="text-sm mt-2">
              Những mẫu mới giúp cải thiện hiệu suất kinh doanh.
            </p>
          </div>
          <button className="mt-6 bg-white text-teal-900 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition">
            Tải xuống ngay
          </button>
        </div>
      </div>
  
      {/* Hoạt động & Hóa đơn gần đây */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Hoạt động</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <span className="text-green-600 font-bold">+ Hóa đơn mới</span> - Francisco Gibbs đã tạo hóa đơn PQ-4491C
              <div className="text-gray-400 text-xs">Vừa xong</div>
            </li>
            <li>
              <span className="text-yellow-600 font-bold">🔔 Nhắc nhở</span> - Đã gửi nhắc hóa đơn JL-3432B đến Chester Corp
              <div className="text-gray-400 text-xs">Thứ Sáu, 12:26 PM</div>
            </li>
          </ul>
        </div>
  
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Hóa đơn gần đây</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b border-gray-300">
              <tr>
                <th className="py-2">Mã</th>
                <th>Ngày tạo</th>
                <th>Khách hàng</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2">PQ-4491C</td>
                <td>03/07/2020</td>
                <td>Daniel Padilla</td>
                <td>$2,450</td>
                <td><span className="text-green-600">ĐÃ THANH TOÁN</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">IN-9911J</td>
                <td>21/05/2021</td>
                <td>Christina Jacobs</td>
                <td>$14,810</td>
                <td><span className="text-red-600">QUÁ HẠN</span></td>
              </tr>
              <tr>
                <td className="py-2">UV-2319A</td>
                <td>14/04/2020</td>
                <td>Elizabeth Bailey</td>
                <td>$450</td>
                <td><span className="text-green-600">ĐÃ THANH TOÁN</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
};

export default Dashboard;
