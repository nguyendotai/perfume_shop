"use client";
import Categories from "../components/categories";
import React from "react";
import SideBar from "../components/sideBar";
import RenderProduct from "../components/renderProduct";
import { ISanPham } from "../components/constructorData";
import { useState, useEffect } from "react";

export default function Products() {
  const [allProducts, setAllProducts] = useState<ISanPham[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ISanPham[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    if (!isFetched) {
      fetch(`http://localhost:3000/api/sanpham`)
        .then((res) => res.json())
        .then((data) => {
          setAllProducts(data);
          setFilteredProducts(data);
          setIsFetched(true);
        })
        .catch((err) => console.log("Lỗi: ", err));
    }
  }, [isFetched]);

  const handleFilterByPrice = (maxPrice: number) => {
    const filtered = allProducts.filter((sp) => sp.gia <= maxPrice);
    setFilteredProducts(filtered);
  };

  const handleSortProducts = (option: string) => {
    setSortOption(option);
    let sortedProducts = [...filteredProducts];

    switch (option) {
      case "Mới nhất":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Cũ nhất":
        sortedProducts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "Giá tăng dần":
        sortedProducts.sort((a, b) => a.gia - b.gia);
        break;
      case "Giá giảm dần":
        sortedProducts.sort((a, b) => b.gia - a.gia);
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
  };
  return (
    <div className="w-full">
      {/* Danh mục */}
      <div className="w-full bg-black">
        <div className="w-[1320px] m-auto">
          <Categories />
        </div>
      </div>
      <div className="w-[1320px] m-auto">
        <div className="flex justify-between items-start">
          {/* SideBar */}
          <div className="w-[23%] h-full mt-1">
            <SideBar onFilterByPrice={handleFilterByPrice} />
          </div>

          {/* Breadcrumb + Products */}
          <div className="w-[80%]">
            <div className="flex justify-between items-center">
              <nav className="my-5">
                <a href="/">Trang chủ</a>
                <span className="mx-2">/</span>
                <a href="/store" className="font-bold">
                  Cửa hàng
                </a>
              </nav>

              <div className="flex items-center space-x-6 text-gray-700 my-5">
                <div>
                  <span className="font-bold">Show :</span>
                  <a href="#" className="text-gray-500 hover:text-black">
                    15
                  </a>
                  <span className="mx-1">/</span>
                  <a href="#" className="text-gray-500 hover:text-black">
                    25
                  </a>
                  <span className="mx-1">/</span>
                  <a href="#" className="text-gray-500 hover:text-black">
                    35
                  </a>
                </div>

                <div className="relative">
                  <select
                    className="border-b text-gray-700 text-sm focus:outline-none"
                    value={sortOption}
                    onChange={(e) => handleSortProducts(e.target.value)}
                  >
                    <option value="">Chọn</option>
                    <option value="Mới nhất">Mới nhất</option>
                    <option value="Cũ nhất">Cũ nhất</option>
                    <option value="Giá tăng dần">Giá tăng dần</option>
                    <option value="Giá giảm dần">Giá giảm dần</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product */}
            <div className="grid grid-cols-4 gap-5">
              {currentProducts.map((sp) => (
                <div key={sp.id}>
                  <RenderProduct product={sp} />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-white text-black hover:bg-gray-200 disabled:opacity-50"
              >
                Trang trước
              </button>

              {Array.from(
                { length: Math.ceil(filteredProducts.length / itemsPerPage) },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === index + 1
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filteredProducts.length / itemsPerPage)
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredProducts.length / itemsPerPage)
                }
                className="px-3 py-1 border rounded bg-white text-black hover:bg-gray-200 disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
