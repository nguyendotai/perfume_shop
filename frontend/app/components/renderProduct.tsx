import Link from "next/link";
import { ISanPham } from "./constructorData";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/cartSlice";

export default function RenderProduct({ product }: { product: ISanPham }) {
    const dispatch = useDispatch();

    const coGiamGia = product.gia_km !== null && product.gia_km < product.gia;
    const discount = coGiamGia
      ? Math.round(((product.gia - product.gia_km!) / product.gia) * 100)
      : 0;

      const handleAddToCart = () => {
        dispatch(
          addToCart({
            id: product.id,
            ten_sp: product.ten_sp,
            gia: coGiamGia ? product.gia_km : product.gia,
            hinh_anh: product.hinh_anh.startsWith("http") ? product.hinh_anh : `/${product.hinh_anh.replace(/^\/+/, '')}`, 
            quantity: 1,
            so_luong: 0
          })
        );
      };      
    return (
      <div className="relative group">
        {/* Hình ảnh sản phẩm */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg transition-transform duration-300">
          {coGiamGia && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-md z-10">
              -{discount}%
            </div>
          )}
          <img
            src={`/${product.hinh_anh}`}
            alt={product.ten_sp}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Nút Thêm vào giỏ hàng (Hiện từ dưới lên khi hover) */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center">
          <button
            className="bg-white border border-red-600 text-black font-semibold text-sm px-4 py-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:z-100 cursor-pointer"
            onClick={handleAddToCart}
            >
            Thêm vào giỏ hàng
          </button>
        </div>

        {/* Tên sản phẩm (Giữ nguyên) */}
        <div className="mt-3 text-center">
          <Link href={`/store/${product.id}`} className="block text-gray-800 font-medium text-sm truncate">
            {product.ten_sp}
          </Link>
        </div>

        {/* Giá sản phẩm (Ẩn khi hover) */}
        <div className="mt-2 text-center transition-opacity duration-300 group-hover:opacity-0">
          {coGiamGia ? (
            <>
              <del className="text-gray-400 text-xs">{product.gia.toLocaleString()} đ</del>
              <div className="text-red-600 text-base font-semibold">{product.gia_km.toLocaleString()} đ</div>
            </>
          ) : (
            <div className="text-red-600 text-base mt-8 font-semibold">{product.gia.toLocaleString()} đ</div>
          )}
        </div>
      </div>
    );
}
