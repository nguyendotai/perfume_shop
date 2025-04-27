"use client";
import { useEffect, useState } from "react";
import { ISanPham } from "../../components/constructorData";
import { useParams } from "next/navigation";
import RenderProduct from "@/app/components/renderProduct";

export default function () {
  const { id } = useParams();
  const [product, setProduct] = useState<ISanPham | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ISanPham[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/sanpham/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Lỗi lấy sản phẩm:", err));
    }

    if (id) {
      fetch(`http://localhost:3000/api/sanpham/sanpham-lienquan/${id}`)
        .then((res) => res.json())
        .then((data) => setRelatedProducts(data))
        .catch((err) => console.error("Lỗi lấy sản phẩm liên quan:", err));
    }
  }, [id]);

  if (!product) return <p className="text-center mt-10">Đang tải...</p>;
  return (
    <div className="w-[1320px] mx-auto mt-10">

      <div className="flex gap-10">
        {/* Hình ảnh sản phẩm */}
        <div className="w-1/2">
          <img
            src={`/${product.hinh_anh}`}
            alt={product.ten_sp}
            className="w-full rounded-lg"
          />        
        </div>

        {/* Thông tin sản phẩm */}
        <div className="w-1/2">
        <div className="flex justify-between items-center">
              <nav className="my-5">
                <a href="/" className="text-gray-500">Trang chủ</a>
                <span className="mx-2 text-gray-500">/</span>
                <a href="/store" className="text-gray-500">Cửa hàng</a>
                <span className="mx-2 text-gray-500">/</span>
                {product ? (
                    <span className="font-semibold">{product.ten_sp}</span>
                ) : (
                    <span className="font-semibold">Đang tải...</span>
                )}
              </nav>
            </div>
          {/* Tên sản phẩm */}
          <h1 className="text-2xl font-semibold">{product.ten_sp}</h1>

          {/* Giá sản phẩm */}
          <div className="mt-3 flex items-center gap-3">
            {product.gia_km && product.gia_km < product.gia ? (
              <>
                <span className="text-gray-400 line-through text-lg">
                  {product.gia.toLocaleString()} đ
                </span>
                <span className="text-red-600 text-2xl font-semibold">
                  {product.gia_km.toLocaleString()} đ
                </span>
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  -{Math.round(100 - (product.gia_km / product.gia) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-red-600 text-2xl font-semibold">
                {product.gia.toLocaleString()} đ
              </span>
            )}
          </div>

          {/* Mô tả sản phẩm */}
          <div className="mt-3 text-gray-600">
            <p className="py-2"><strong>Nhóm nước hoa:</strong> {product.phong_cach}</p>
            <p className="py-2"><strong>Giới tính:</strong> {product.gender}</p>
            <p className="py-2"><strong>Năm ra mắt:</strong> {product.nam_ra_mat}</p>
            <p className="py-2"><strong>Nồng độ:</strong> {product.nong_do}</p>
          </div>

          {/* Hương nước hoa */}
          <div className="mt-3 text-gray-600">
            <p className="py-2"><strong>Hương đầu:</strong> {product.huong_dau}</p>
            <p className="py-2"><strong>Hương giữa:</strong> {product.huong_giua}</p>
            <p className="py-2"><strong>Hương cuối:</strong> {product.huong_cuoi}</p>
          </div>

          {/* Hộp thông tin sản phẩm */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">
            {product.ten_sp} – {product.dung_tich}ml
            </p>

                
            <p className="text-red-600 text-lg font-bold">
              {product.gia_km?.toLocaleString() || product.gia.toLocaleString()} đ
            </p>
          </div>

          {/* Nút Mua hàng */}
          <div className="mt-4 flex gap-3">
            <button className="px-6 py-3 bg-black text-white font-bold rounded-lg">
              MUA NGAY
            </button>
            <button className="px-6 py-3 border border-black text-black font-bold rounded-lg">
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          {/* Thông tin doanh nghiệp */}
          <div className="mt-6 text-gray-500 text-sm">
            <p><strong>Mã:</strong> N/A</p>
            <p><strong>Danh mục:</strong> Nước Hoa Nữ</p>
            <p><strong>Brand:</strong> {product.brand}</p>
          </div>
        </div>
      </div>
      {/* Sản phẩm liên quan */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold mb-10">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-4 gap-6">
          {relatedProducts.map((sp) => (
            <div key={sp.id}>
              <RenderProduct product={sp} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
