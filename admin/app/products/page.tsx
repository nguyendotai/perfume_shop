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
  brand?: string;
  gender?: string;
  nam_ra_mat?: number;
  nong_do?: string;
  phong_cach?: string;
  huong_dau?: string;
  huong_giua?: string;
  huong_cuoi?: string;
  dung_tich?: number;
  hot?: number;
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
    gia: undefined as number | undefined, // Thay 0 bằng undefined
    gia_km: undefined as number | undefined, // Thay 0 bằng undefined
    hinh_anh: null as File | null,
    danh_muc_id: 0,
    an_hien: 1,
    nam_ra_mat: new Date().getFullYear(),
    brand: "",
    gender: "",
    nong_do: "",
    phong_cach: "",
    huong_dau: "",
    huong_giua: "",
    huong_cuoi: "",
    dung_tich: undefined as number | undefined, // Thay 0 bằng undefined
    hot: undefined as number | undefined, // Thay 0 bằng undefined
  });

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    // 👇 Gọi resetForm khi đóng form
    if (isFormVisible) {
      resetForm();
    }
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    if (
      name === "gia" ||
      name === "gia_km" ||
      name === "dung_tich" ||
      name === "nam_ra_mat" ||
      name === "hot"
    ) {
      parsedValue = value === "" ? undefined : parseInt(value, 10) || undefined;
    } else if (name === "danh_muc_id") {
      parsedValue = parseInt(value, 10);
    } else if (name === "an_hien") {
      parsedValue = (e.target as HTMLInputElement).checked ? 1 : 0;
    }
  
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: parsedValue,
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
      gia: undefined,
      gia_km: undefined,
      hinh_anh: null,
      danh_muc_id: 0,
      an_hien: 1,
      nam_ra_mat: new Date().getFullYear(),
      brand: "",
      gender: "",
      nong_do: "",
      phong_cach: "",
      huong_dau: "",
      huong_giua: "",
      huong_cuoi: "",
      dung_tich: undefined,
      hot: undefined,
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
    formData.append("gia", newProduct.gia?.toString() || "");
    formData.append("gia_km", newProduct.gia_km?.toString() || "");
    formData.append("danh_muc_id", newProduct.danh_muc_id.toString());
    formData.append("an_hien", newProduct.an_hien.toString());
    formData.append("nam_ra_mat", newProduct.nam_ra_mat?.toString() || "");
    formData.append("brand", newProduct.brand || ""); // Thêm trường brand
    formData.append("gender", newProduct.gender || ""); // Thêm trường gender
    formData.append("nong_do", newProduct.nong_do || ""); // Thêm trường nong_do
    formData.append("phong_cach", newProduct.phong_cach || ""); // Thêm trường phong_cach
    formData.append("huong_dau", newProduct.huong_dau || ""); // Thêm trường huong_dau
    formData.append("huong_giua", newProduct.huong_giua || ""); // Thêm trường huong_giua
    formData.append("huong_cuoi", newProduct.huong_cuoi || ""); // Thêm trường huong_cuoi
    formData.append("dung_tich", newProduct.dung_tich?.toString() || "");
    formData.append("hot", newProduct.hot?.toString() || "");
    formData.append("createdAt", new Date().toISOString());
    formData.append("updatedAt", new Date().toISOString());

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
    <div className="p-6 bg-gray-100 text-gray-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-500">Sắp xếp theo:</label>
          <select
            className="bg-white text-gray-900 p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          onClick={() => {
            resetForm(); // 👈 Reset form trước khi hiển thị
            toggleForm();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Bảng sản phẩm */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Danh sách sản phẩm
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="text-gray-500 bg-gray-50 border-b border-gray-200">
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
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-900">{product.ten_sp}</td>
                  <td className="py-3 px-4 text-gray-700">{product.mo_ta}</td>
                  <td className="py-3 px-4">
                    <img
                      src={`http://localhost:3000/uploads/products/${product.hinh_anh}`}
                      alt={`Sản phẩm ${product.id}`}
                      className="w-12 h-12 object-cover rounded shadow-sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {product.danh_muc?.ten_danh_muc}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {product.gia?.toLocaleString()}đ
                  </td>

                  <td className="py-3 px-4 text-gray-900">
                    {product.gia_km != null
                      ? product.gia_km.toLocaleString() + "đ"
                      : "—"}
                  </td>

                  <td className="py-3 px-4 text-gray-700">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="py-3 px-4 text-gray-700">
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="py-3 px-4 text-green-500">Hiển thị</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setNewProduct((prevState) => ({
                          ...prevState, // Giữ nguyên các trường cũ
                          ...product, // Cập nhật từ product
                          hinh_anh: null, // Chỉ reset hinh_anh thành null
                        }));
                        setSelectedProduct(product);
                        setIsFormVisible(true);
                      }}
                    >
                      Sửa
                    </button>

                    <button
                      className="text-red-500 hover:underline"
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
              className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl z-10 border border-gray-200 overflow-y-auto max-h-[90vh] "
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <label
                    className="block text-sm text-gray-700"
                    htmlFor="danh_muc_id"
                  >
                    Danh mục
                  </label>
                  <select
                    id="danh_muc_id"
                    name="danh_muc_id"
                    value={newProduct.danh_muc_id}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        danh_muc_id: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value={0} disabled hidden>
                      -- Chọn danh mục --
                    </option>
                    {category.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.ten_danh_muc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm text-gray-700"
                    htmlFor="ten_sp"
                  >
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    id="ten_sp"
                    name="ten_sp"
                    value={newProduct.ten_sp}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm text-gray-700"
                    htmlFor="mo_ta"
                  >
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    id="mo_ta"
                    name="mo_ta"
                    value={newProduct.mo_ta}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="gia"
                    >
                      Giá sản phẩm (VND)
                    </label>
                    <input
                      type="number"
                      id="gia"
                      name="gia"
                      value={newProduct.gia}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="gia_km"
                    >
                      Giá khuyến mãi (VND)
                    </label>
                    <input
                      type="number"
                      id="gia_km"
                      name="gia_km"
                      value={newProduct.gia_km}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="brand"
                    >
                      Thương hiệu
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={newProduct.brand || ""}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="gender"
                    >
                      Giới tính
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={newProduct.gender || ""}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="nam_ra_mat"
                    >
                      Năm ra mắt
                    </label>
                    <input
                      type="number"
                      id="nam_ra_mat"
                      name="nam_ra_mat"
                      value={newProduct.nam_ra_mat || new Date().getFullYear()}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="nong_do"
                    >
                      Nồng độ
                    </label>
                    <input
                      type="text"
                      id="nong_do"
                      name="nong_do"
                      value={newProduct.nong_do || ""}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="phong_cach"
                    >
                      Phong cách
                    </label>
                    <input
                      type="text"
                      id="phong_cach"
                      name="phong_cach"
                      value={newProduct.phong_cach || ""}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="huong_dau"
                    >
                      Hương đầu
                    </label>
                    <input
                      type="text"
                      id="huong_dau"
                      name="huong_dau"
                      value={newProduct.huong_dau || ""}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="huong_giua"
                    >
                      Hương giữa
                    </label>
                    <input
                      type="text"
                      id="huong_giua"
                      name="huong_giua"
                      value={newProduct.huong_giua || ""}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm text-gray-700"
                      htmlFor="huong_cuoi"
                    >
                      Hương cuối
                    </label>
                    <input
                      type="text"
                      id="huong_cuoi"
                      name="huong_cuoi"
                      value={newProduct.huong_cuoi || ""}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm text-gray-700"
                    htmlFor="dung_tich"
                  >
                    Dung tích (ml)
                  </label>
                  <input
                    type="number"
                    id="dung_tich"
                    name="dung_tich"
                    value={newProduct.dung_tich || 0}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700" htmlFor="hot">
                    Sản phẩm nổi bật
                  </label>
                  <select
                    id="hot"
                    name="hot"
                    value={newProduct.hot || 0}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={0}>Không</option>
                    <option value={1}>Có</option>
                  </select>
                </div>

                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="an_hien"
                    name="an_hien"
                    checked={newProduct.an_hien === 1}
                    onChange={(e) =>
                      setNewProduct((prevState) => ({
                        ...prevState,
                        an_hien: e.target.checked ? 1 : 0, // 1 là hiển thị, 0 là ẩn
                      }))
                    }
                    className="w-4 h-4 bg-white border border-gray-300 text-green-500 focus:ring-green-500 rounded"
                  />
                  <label
                    htmlFor="an_hien"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Hiển thị sản phẩm
                  </label>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm text-gray-700"
                    htmlFor="hinh_anh"
                  >
                    Hình ảnh sản phẩm
                  </label>
                  <input
                    type="file"
                    id="hinh_anh"
                    name="hinh_anh"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    accept="image/*"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-400 shadow-md"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-400 shadow-md"
                  >
                    {selectedProduct ? "Cập nhật" : "Thêm sản phẩm"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Product;
