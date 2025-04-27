import React, { useState, useEffect, useRef } from "react";
import { ISanPham } from "./constructorData";
import Link from "next/link";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ISanPham[]>([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null); // Sử dụng ref cho input
  const searchResultsRef = useRef<HTMLDivElement | null>(null); // Sử dụng ref cho kết quả tìm kiếm

  // Hàm tìm kiếm
  const handleSearch = async (query: string) => {
    if (!query.trim()) return; // Nếu không có từ khóa thì không tìm kiếm

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/sanpham/timkiem/${query}`
      );
      const data = await response.json();
      setSearchResults(data.products);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce: Gọi hàm tìm kiếm sau khi người dùng ngừng nhập trong một khoảng thời gian nhất định
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery); // Gọi API tìm kiếm khi người dùng ngừng gõ
    }, 500); // 500ms là thời gian debounce, có thể thay đổi tùy vào nhu cầu

    return () => clearTimeout(delayDebounceFn); // Dọn dẹp timeout nếu người dùng tiếp tục gõ
  }, [searchQuery]); // Mỗi khi searchQuery thay đổi, debounce sẽ được kích hoạt

  // Reset search khi chuyển trang
  const handleProductClick = () => {
    setSearchQuery(""); // Reset từ khóa tìm kiếm
    setSearchResults([]); // Reset kết quả tìm kiếm
  };

  // Kiểm tra khi người dùng nhấn ra ngoài để ẩn kết quả tìm kiếm
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node) &&
      searchResultsRef.current &&
      !searchResultsRef.current.contains(event.target as Node)
    ) {
      setSearchResults([]); // Ẩn kết quả khi nhấn ra ngoài
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-80">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Tìm sản phẩm của bạn"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Gọi handleSearch mỗi khi người dùng nhập
        className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <button
        onClick={() => handleSearch(searchQuery)}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1 0-1.15 1.15L21 21z"
          ></path>
        </svg>
      </button>

      {loading && <div className="text-gray-500">Đang tìm kiếm...</div>}

      <div
        ref={searchResultsRef}
        className="absolute w-full"
      >
        {searchResults.length > 0 ? (
          <ul className="bg-white border-gray-300 rounded-lg shadow-lg z-10">
            {searchResults.map((product) => (
              <li
                key={product.id}
                className="py-2 px-4 hover:bg-gray-100 flex items-center"
              >
                {/* Hiển thị ảnh sản phẩm */}
                <img
                  src={product.hinh_anh || "/default-image.jpg"} // Sử dụng ảnh mặc định nếu không có ảnh
                  alt={product.ten_sp}
                  className="w-12 h-12 object-cover rounded-full mr-4"
                />

                {/* Hiển thị tên sản phẩm */}
                <Link
                  href={`/store/${product.id}`}
                  onClick={handleProductClick}
                  className="text-gray-800"
                >
                  {product.ten_sp}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          !loading &&
          searchQuery && (
            <div className="text-gray-500 px-4 py-2 bg-white border border-gray-300 rounded-lg">
              Không tìm thấy sản phẩm
            </div>
          )
        )}
      </div>
    </div>
  );
}
