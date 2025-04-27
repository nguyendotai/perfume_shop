"use client";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { RootState } from "@/lib/store";
import { addToCart, removeFromCart, updateQuantity } from "@/lib/cartSlice"; // Cần thêm action updateQuantity
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleIncreaseQuantity = (id: number) => {
    dispatch(updateQuantity({ id, quantity: 1 }));
  };

  const handleDecreaseQuantity = (id: number) => {
    dispatch(updateQuantity({ id, quantity: -1 }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem("checkoutCart", JSON.stringify(cart));

    // Chuyển hướng đến trang thanh toán
    router.push("/checkout");
  };

  return (
    <div className="w-full">
      <div className="w-full bg-black">
        <div className="w-[1320px] mx-auto">
          <div className=" flex justify-center items-center gap-5">
            <div className="relative group py-3 ">
              <Link
                href=""
                className="font-medium text-[16px] block text-white  relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-500 after:transition-all after:duration-300 group-hover:after:w-full "
              >
                GIỎ HÀNG
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1320px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-4 shadow rounded-lg">
            {cart.length === 0 ? (
              <p>Giỏ hàng của bạn đang trống.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center border-b py-4">
                  <Image
                    src={
                      item.hinh_anh.startsWith("http")
                        ? item.hinh_anh
                        : `/` + item.hinh_anh.replace(/^\/+/, "")
                    }
                    alt={item.ten_sp}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="font-semibold">{item.ten_sp}</h2>
                    <p className="text-gray-500">Giá: {item.gia.toLocaleString()} đ</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="px-2 py-1 border"
                      onClick={() => handleDecreaseQuantity(item.id)} // Giảm số lượng
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="px-2 py-1 border"
                      onClick={() => handleIncreaseQuantity(item.id)} // Tăng số lượng
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="ml-4 text-gray-500"
                    onClick={() => handleRemove(item.id)}
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold">Cộng Giỏ Hàng</h2>
            <div className="flex justify-between mt-2">
              <span>Tạm tính:</span>
              <span className="font-bold">
                {cart
                  .reduce(
                    (total, item) => total + item.gia * item.quantity,
                    0
                  )
                  .toLocaleString()}{" "}
                đ
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-black text-white py-2 rounded"
            >
              Tiến Hành Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
