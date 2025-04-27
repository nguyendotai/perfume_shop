import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ISanPham } from "./constructorData";
import RenderProduct from "./renderProduct";
import "../css/scrollHide.css";

// Component nút tùy chỉnh
function PrevArrow({ className, style, onClick, ...rest }: any) {
  return (
    <button
      className={`${className} absolute !left-[-30px] !z-10`} // Giảm độ lệch của nút trái
      style={{ ...style, display: "block", fontSize: "60px", color: "#333" }}
      onClick={onClick}
    >
      ‹
    </button>
  );
}

function NextArrow({ className, style, onClick, ...rest }: any) {
  return (
    <button
      className={`${className} absolute !right-[-30px] !z-10`} // Đưa nút phải vào gần hơn
      style={{ ...style, display: "block", fontSize: "60px", color: "#333" }}
      onClick={onClick}
    >
      ›
    </button>
  );
}

export default function ProductCarousel({
  products,
}: {
  products: ISanPham[];
}) {
  const settings = {
    dots: true, // Hiển thị dấu chấm
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Hiển thị 5 sản phẩm
    slidesToScroll: 1,
    arrows: true, // Hiển thị nút trái/phải
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    autoplay: true, // Tự động chạy
    autoplaySpeed: 2000, // 3 giây mỗi lần chuyển slide
  };
  

  return (
    <div className="w-[1320px] mx-auto p-2 relative">
      <Slider {...settings}>
        {products.map((sp) => (
          <div key={sp.id} className="w-[200px] flex gap-2">
            <RenderProduct product={sp} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
