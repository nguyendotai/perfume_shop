"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  ten_danh_muc: string;
  an_hien: number;
  createdAt: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({
    id: 0,
    ten_danh_muc: "",
    an_hien: 1,
    createdAt: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    // Thực hiện API lấy danh sách danh mục
    const response = await fetch("http://localhost:3000/api/danhmuc");
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setNewCategory({
        id: 0,
        ten_danh_muc: "",
        an_hien: 1,
        createdAt: "",
    });
    setSelectedCategory(null);
  };

  const toggleForm = () => {
    if (isFormVisible) {
      // Khi form đang mở, đóng lại thì reset form
      resetForm();
    }
    setIsFormVisible(!isFormVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      // Cập nhật danh mục
      await fetch(`http://localhost:3000/api/danhmuc/${selectedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
    } else {
      // Thêm danh mục mới
      await fetch("http://localhost:3000/api/danhmuc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
    }
    fetchCategories();
    resetForm();
    toggleForm();
  };

  const handleDelete = async (id: number) => {
    // Xóa danh mục
    const confirmDelete = window.confirm(
        "Bạn có chắc muốn xoá sản phẩm này không?"
      );
      if (!confirmDelete) return;
    await fetch(`http://localhost:3000/api/danhmuc/${id}`, {
      method: "DELETE",
    });
    fetchCategories();
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-100 text-gray-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách danh mục</h1>
        <button
          onClick={toggleForm}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
        >
          + Thêm danh mục
        </button>
      </div>
  
      {/* Bảng danh mục */}
      <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold mb-4">Danh sách danh mục</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-800 border border-gray-300 bg-white rounded-lg overflow-hidden">
            <thead className="text-gray-600 border-b border-gray-300 bg-gray-100">
              <tr>
                <th className="py-3 px-4 cursor-pointer">STT</th>
                <th className="py-3 px-4 cursor-pointer">Tên danh mục</th>
                <th className="py-3 px-4 cursor-pointer">Ngày tạo</th>
                <th className="py-3 px-4 cursor-pointer">Trạng thái</th>
                <th className="py-3 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{category.ten_danh_muc}</td>
                  <td className="py-3 px-4">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-green-600">
                    {category.an_hien ? "Hiển thị" : "Ẩn"}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedCategory(category);
                        setNewCategory({
                          id: category.id,
                          ten_danh_muc: category.ten_danh_muc,
                          an_hien: category.an_hien,
                          createdAt: category.createdAt,
                        });
                        setIsFormVisible(true);
                      }}
                    >
                      Sửa
                    </button>
  
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(category.id)}
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
  
      {/* Form thêm danh mục */}
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
              className="absolute inset-0 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleForm}
            />
  
            {/* Form thêm danh mục */}
            <motion.div
              className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-xl z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-semibold mb-4">
                {selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
              </h3>
  
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-gray-700" htmlFor="ten_danh_muc">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    id="ten_danh_muc"
                    name="ten_danh_muc"
                    value={newCategory.ten_danh_muc}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900"
                    required
                  />
                </div>
  
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="an_hien"
                    name="an_hien"
                    checked={newCategory.an_hien === 1}
                    onChange={(e) =>
                      setNewCategory((prevState) => ({
                        ...prevState,
                        an_hien: e.target.checked ? 1 : 0,
                      }))
                    }
                    className="w-4 h-4 border border-gray-300"
                  />
                  <label htmlFor="an_hien" className="ml-2 text-sm text-gray-700">
                    Hiển thị danh mục
                  </label>
                </div>
  
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      toggleForm();
                    }}
                    className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-400"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-400"
                  >
                    {selectedCategory ? "Cập nhật" : "Thêm danh mục"}
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

export default Categories;
