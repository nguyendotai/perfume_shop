"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ILoai, ISanPham } from "../../components/constructorData";
import RenderProduct from "../../components/renderProduct";
import SideBar from "../../components/sideBar";
import Categories from "../../components/categories";

export default function ProductByCate() {
  const params = useParams();
  const id = Number(params.id);
  const [filteredProducts, setFilteredProducts] = useState<ISanPham[]>([]);
  const [productArr, setProductArr] = useState<ISanPham[]>([]);
  const [category, setCategory] = useState<ILoai | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    const fetchPro = async () => {
      const resPro = await fetch(
        `http://localhost:3000/api/sanpham/trongdanhmuc/${id}`
      );
      const data = await resPro.json();
      setProductArr(data.products);
      setFilteredProducts(data.products); // Gán danh sách ban đầu
      setTotalPages(data.totalPages);
      setIsLoading(false);
    };
    const fetchCate = async () => {
      const resCate = await fetch(`http://localhost:3000/api/danhmuc/${id}`);
      const result_cate = await resCate.json();
      setCategory(result_cate as ILoai);
    };
    fetchPro();
    fetchCate();
  }, [id, page]);

  const handleFilterByPrice = (maxPrice: number) => {
    const filtered = productArr.filter((sp) => sp.gia <= maxPrice);
    setFilteredProducts(filtered);
    setPage(1); // quay về trang 1
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
    setPage(1); // quay về trang 1
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
                <a href="/store">Cửa hàng</a>
                <span className="mx-2">/</span>
                {category ? (
                  <span className="font-bold">{category.ten_danh_muc}</span>
                ) : (
                  <span className="font-bold">Đang tải...</span>
                )}
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
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div>
                <div className="grid grid-cols-4 gap-5">
                  {filteredProducts
                    .slice((page - 1) * limit, page * limit)
                    .map((sp) => (
                      <RenderProduct key={sp.id} product={sp} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    className="px-4 py-2 border rounded hover:bg-gray-200"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Trang trước
                  </button>

                  {[
                    ...Array(Math.ceil(filteredProducts.length / limit)).keys(),
                  ].map((i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 border rounded ${
                        page === i + 1
                          ? "bg-black text-white"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="px-4 py-2 border rounded hover:bg-gray-200"
                    disabled={
                      page === Math.ceil(filteredProducts.length / limit)
                    }
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
