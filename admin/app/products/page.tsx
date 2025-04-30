"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // 👈 Import Framer Motion

interface Product {
  id: number;
  ten_sp: string;
  mo_ta: string;
  gia: number;
  gia_km: number;
  hinh_anh: string;
  createdAt: string;
  updatedAt: string;
  an_hien: number;
  danh_muc?: Category;
}

interface Category {
  id: number;
  ten_danh_muc: string;
  an_hien: number;
  createdAt: string;
}

const Product = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    ten_sp: "",
    mo_ta: "",
    gia: 0,
    gia_km: 0,
    hinh_anh: null as File | null,
    danh_muc_id: 0,
    an_hien: 1,
    nam_ra_mat: new Date().getFullYear(),
  });

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Lấy danh sách sản phẩm khi component tải
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sanpham");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/danhmuc");
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchCategory();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewProduct((prevState) => ({
        ...prevState,
        hinh_anh: file,
      }));
    }
  };

  const resetForm = () => {
    setNewProduct({
      ten_sp: "",
      mo_ta: "",
      gia: 0,
      gia_km: 0,
      hinh_anh: null,
      danh_muc_id: 0,
      an_hien: 1,
      nam_ra_mat: new Date().getFullYear(),
    });
    setSelectedProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = selectedProduct !== null;
    const url = isEditing
      ? `http://localhost:3000/api/sanpham/${selectedProduct.id}`
      : "http://localhost:3000/api/sanpham";
    const method = isEditing ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("ten_sp", newProduct.ten_sp);
    formData.append("mo_ta", newProduct.mo_ta);
    formData.append("gia", newProduct.gia.toString());
    formData.append("gia_km", newProduct.gia_km.toString());
    formData.append("danh_muc_id", newProduct.danh_muc_id.toString());
    formData.append("an_hien", newProduct.an_hien.toString());
    formData.append("nam_ra_mat", newProduct.nam_ra_mat.toString());

    formData.append("createdAt", new Date().toISOString()); // Ngày tạo
    formData.append("updatedAt", new Date().toISOString()); // Ngày sửa
    
    if (newProduct.hinh_anh) {
      formData.append("hinh_anh", newProduct.hinh_anh);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();
      console.log("Response Text:", text);

      if (response.ok) {
        const result = JSON.parse(text);
        if (isEditing) {
          setProducts((prev) =>
            prev.map((product) =>
              product.id === result.product.id ? result.product : product
            )
          );
        } else {
          setProducts((prev) => [...prev, result.product]);
        }
        setIsFormVisible(false);

        // 🔄 Reset lại form sau khi thêm hoặc chỉnh sửa thành công
        resetForm();

        alert(
          isEditing
            ? "✅ Chỉnh sửa sản phẩm thành công!"
            : "✅ Thêm sản phẩm thành công!"
        );
      } else {
        console.error("Lỗi khi thêm hoặc chỉnh sửa sản phẩm:", text);
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xoá sản phẩm này không?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/sanpham/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      const result = await response.json();
      if (response.ok) {
        // Xóa sản phẩm khỏi danh sách trên giao diện
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        alert("✅ Xóa sản phẩm thành công!");
      } else {
        console.error("Lỗi khi xóa sản phẩm:", result.error);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API xóa sản phẩm:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-100 text-gray-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Sắp xếp theo:</label>
          <select
            className="bg-white text-gray-800 p-2 rounded-md border border-gray-300"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
          </select>
        </div>
  
        <button
          onClick={toggleForm}
          className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
        >
          + Thêm sản phẩm
        </button>
      </div>
  
      {/* Bảng sản phẩm */}
      <div className="bg-white p-6 rounded-xl border border-gray-300 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-800 border border-gray-300 bg-white rounded-lg overflow-hidden">
            <thead className="text-gray-600 border-b border-gray-300 bg-gray-100">
              <tr>
                <th className="py-3 px-4 cursor-pointer">STT</th>
                <th className="py-3 px-4 cursor-pointer">Tên sản phẩm</th>
                <th className="py-3 px-4 cursor-pointer">Mô tả</th>
                <th className="py-3 px-4 cursor-pointer">Hình ảnh</th>
                <th className="py-3 px-4 cursor-pointer">Danh mục</th>
                <th className="py-3 px-4 cursor-pointer">Giá</th>
                <th className="py-3 px-4 cursor-pointer">Giá khuyến mãi</th>
                <th className="py-3 px-4 cursor-pointer">Ngày tạo</th>
                <th className="py-3 px-4 cursor-pointer">Ngày sửa</th>
                <th className="py-3 px-4 cursor-pointer">Trạng thái</th>
                <th className="py-3 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{product.ten_sp}</td>
                  <td className="py-3 px-4">{product.mo_ta}</td>
                  <td className="py-3 px-4">
                    <img
                      src={`http://localhost:3000/uploads/products/${product.hinh_anh}`}
                      alt={`Sản phẩm ${product.id}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4">{product.danh_muc?.ten_danh_muc}</td>
                  <td className="py-3 px-4">{product.gia?.toLocaleString()}đ</td>
                  <td className="py-3 px-4">
                    {product.gia_km != null
                      ? product.gia_km.toLocaleString() + "đ"
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-green-600">Hiển thị</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setNewProduct((prevState) => ({
                          ...prevState,
                          ...product,
                          hinh_anh: null,
                        }));
                        setSelectedProduct(product);
                        setIsFormVisible(true);
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(product.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Form thêm sản phẩm */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Lớp phủ đen mờ */}
            <motion.div
              className="absolute inset-0 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleForm}
            />
  
            {/* Form thêm sản phẩm */}
            <motion.div
              className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-xl z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-semibold mb-4">
                {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
              </h3>
  
              <form onSubmit={handleSubmit}>
                {/* ... giữ nguyên nội dung form nhưng đổi màu giống light mode như trên ... */}
                {/* Ví dụ cho input: */}
                <input
                  type="text"
                  id="ten_sp"
                  name="ten_sp"
                  value={newProduct.ten_sp}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900"
                  required
                />
                {/* ...tương tự cho các input khác */}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
};

export default Product;
