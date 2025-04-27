const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const danhMucRoutes = require("./routes/danhMucRoutes");
const sanPhamRoutes = require("./routes/sanPhamRoutes");
const userRoutes = require("./routes/userRoutes");
const donHangRoutes = require("./routes/donHangRoutes");

const app = express();
const port = 3000;

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Kiểm tra kết nối database
sequelize.authenticate()
    .then(() => console.log("Kết nối đến database thành công"))
    .catch(err => console.error("Lỗi kết nối database:", err));

// Sử dụng các routes
app.use('/api/danhmuc', danhMucRoutes);
app.use('/api/sanpham', sanPhamRoutes);
app.use('/api', userRoutes); // Các route liên quan đến user (đăng ký, đăng nhập, ...)
app.use('/api/donhang', donHangRoutes);

app.listen(port, () => {
    console.log(`Ứng dụng chạy trên cổng ${port}`);
});