const Footer = () => {
    return (
      <footer className="bg-black text-white py-10 mt-10">
        <div className="w-[1320px] mx-auto">
          <div className="grid grid-cols-4 gap-10">
            {/* Logo và thông tin liên hệ */}
            <div>
              <h2 className="text-4xl font-bold text-gold">ROSA</h2>
              <p className="mt-2">WEB NƯỚC HOA BÁN LẺ GIÁ TỐT NHẤT</p>
              <p className="mt-4">Mọi thắc mắc liên hệ: <span className="font-semibold">0979 335 330</span></p>
            </div>
  
            {/* Hệ thống showroom */}
            <div>
              <h3 className="font-semibold text-lg">HỆ THỐNG SHOWROOM</h3>
              <p className="mt-2">
                <span className="font-semibold">SHOWROOM 1:</span> 70 Tuệ Tĩnh, Hai Bà Trưng, Hà Nội
              </p>
              <p>[ Sát ngã tư Bà Triệu - Tuệ Tĩnh ]</p>
              <p className="mt-2">
                <span className="font-semibold">SHOWROOM 2:</span> 33 CMT 8, P. Bến Thành, Q.1, HCM
              </p>
              <p className="mt-2">
                <span className="font-semibold">GIỜ HOẠT ĐỘNG:</span> 8h30 - 22h00 ( cả T7, CN )
              </p>
            </div>
  
            {/* Hỗ trợ khách hàng */}
            <div>
              <h3 className="font-semibold text-lg">HỖ TRỢ KHÁCH HÀNG</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Cách thức mua hàng</a></li>
                <li><a href="#" className="hover:underline">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:underline">Chính sách bảo hành và đổi hàng</a></li>
              </ul>
            </div>
  
            {/* Về chúng tôi */}
            <div>
              <h3 className="font-semibold text-lg">VỀ CHÚNG TÔI</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Giới Thiệu</a></li>
                <li><a href="#" className="hover:underline">Hệ Thống Showroom</a></li>
                <li><a href="#" className="hover:underline">Liên Hệ</a></li>
              </ul>
            </div>
          </div>
  
          {/* Thông tin công ty */}
          <div className="mt-10 border-t border-gray-700 pt-5 text-sm text-gray-400 text-center">
            <p>CÔNG TY CỔ PHẦN THƯƠNG MẠI XUẤT NHẬP KHẨU ROSA VIỆT NAM</p>
            <p>OFFICE: 68 Ngũ Nhạc, P. Thanh Trì, Q. Hoàng Mai – Hà Nội.</p>
            <p>Mã số doanh nghiệp: 0108111795 Do sở kế hoạch đầu tư TP Hà Nội cấp ngày 02/01/2018.</p>
            <p className="mt-2">
              <span className="text-white">© 2021 ROSA PERFUME</span> – Powered by The Zest
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  