"use client";
import { useEffect, useState } from "react";
import Banner from "./components/banner";
import ProductCarousel from "./components/productCarousel";
import { ISanPham } from "./components/constructorData";
import Image from "next/image";
import RenderProduct from "./components/renderProduct";
import Categories from "./components/categories";

export default function Home() {
  const [hotProducts, setHotProducts] = useState<ISanPham[]>([]);
  const [newProducts, setNewProducts] = useState<ISanPham[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!isFetched) {
      fetch(`http://localhost:3000/api/sanpham/hot/10`)
        .then((res) => res.json())
        .then((data) => {
          setHotProducts(data);
          setIsFetched(true);
        })
        .catch((err) => console.log("Lỗi: ", err));
    }
  }, [isFetched]);

  useEffect(() => {
    if (!isFetched) {
      fetch(`http://localhost:3000/api/sanpham/moi/10`)
        .then((res) => res.json())
        .then((data) => {
          setNewProducts(data);
          setIsFetched(true);
        })
        .catch((err) => console.log("Lỗi: ", err));
    }
  }, [isFetched]);

  // Lọc sản phẩm có khuyến mãi
  const saleProducts = hotProducts.filter(
    (sp) => sp.gia_km !== null && sp.gia_km < sp.gia
  );

  return (
    <div className="w-full">
      {/* Banner chính */}
      <div className="w-[1320px] mx-auto p-2">
        <Banner />
      </div>
      {/* FLASH SALE - Chỉ hiển thị sản phẩm có sale */}
      <div className="w-[1320px] mx-auto p-2">
        <h1 className="text-center text-[35px] font-semibold text-red-500 my-5">
          FLASH SALE - GIÁ SỐC MỖI NGÀY
        </h1>
        <ProductCarousel products={saleProducts} />
      </div>

      {/* Banner Phụ */}
      <div className="w-[1320px] mx-auto p-2">
        <div className="flex justify-center items-center gap-5">
          <Image
            src="/banner-2.png"
            alt="Banner nhỏ 1"
            width={400}
            height={250}
            className="rounded-lg object-cover w-full h-[250px]"
          />
          <Image
            src="/banner-1.png"
            alt="Banner nhỏ 2"
            width={400}
            height={250}
            className="rounded-lg object-cover w-full h-[250px]"
          />
        </div>
      </div>

      {/* Sản phẩm khuyến mãi - Chỉ hiển thị sản phẩm có sale */}
      <div className="w-full p-10 bg-red-500">
        <div className="w-[1320px] mx-auto p-2 bg-white rounded-lg">
          <h1 className="text-center font-semibold text-[35px] text-red-600 my-5">
            SẢN PHẨM KHUYẾN MÃI
          </h1>
          <div className="grid grid-cols-5 gap-5">
            {saleProducts.map((sp) => (
              <div key={sp.id}>
                <RenderProduct product={sp} />
              </div>
            ))}
          </div>
          <a
            href="#"
            className="block w-40 mx-auto mt-5 text-white text-center bg-black p-2 rounded-[5px]"
          >
            Xem thêm
          </a>
        </div>
      </div>

      {/* Sản phẩm mới nhất - Hiển thị cả sản phẩm sale và không sale */}
      <div className="w-full p-10">
        <div className="w-[1320px] mx-auto p-2 bg-white">
          <h1 className="text-center font-semibold text-[35px] mb-10">
            Nước Hoa Mới Nhất
          </h1>
          <div className="grid grid-cols-5 gap-5">
            {newProducts.map((sp) => (
              <div key={sp.id}>
                <RenderProduct product={sp} />
              </div>
            ))}
          </div>
          <a
            href="#"
            className="block w-40 mx-auto mt-5 text-white text-center bg-black p-2 rounded-[5px]"
          >
            Xem thêm
          </a>
        </div>
      </div>
    </div>
  );
}
