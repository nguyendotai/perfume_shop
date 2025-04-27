const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nguyendotai11@gmail.com",         // Thay bằng email của bạn
        pass: "cant cufv hgie uoer",     // Lấy ở trang mật khẩu ứng dụng của Google
    },
});

module.exports = transporter;