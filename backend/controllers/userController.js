const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const transporter = require('../utils/mail');
const secretKey = "your_secret_key"; // Thay bằng key bảo mật thật

const userController = {
    registerUser: async (req, res) => {
        try {
            const { ho_ten, email, mat_khau, dia_chi, so_dien_thoai } = req.body;
            const anh_dai_dien = req.file ? req.file.filename : null;

            if (!ho_ten || !email || !mat_khau) {
                return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
            }

            const userExist = await User.findOne({ where: { email } });
            if (userExist) return res.status(400).json({ error: "Email đã tồn tại" });

            const hashedPassword = await bcrypt.hash(mat_khau, 10);
            const token = uuidv4(); // Tạo token bằng uuid

            const newUser = await User.create({
                ho_ten,
                email,
                mat_khau: hashedPassword,
                dia_chi,
                so_dien_thoai,
                anh_dai_dien,
                remember_token: token,
            });

            // Gửi mail kích hoạt
            const kichHoatLink = `http://localhost:3000/api/kichhoat?token=${token}`;
            const mailOptions = {
                from: "your-email@gmail.com",
                to: email,
                subject: "Kích hoạt tài khoản của bạn",
                html: `<p>Xin chào ${ho_ten},</p>
                       <p>Bạn đã đăng ký tài khoản thành công. Vui lòng click vào link bên dưới để kích hoạt:</p>
                       <a href="${kichHoatLink}">${kichHoatLink}</a>`
            };

            await transporter.sendMail(mailOptions);

            res.json({ message: "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản." });
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            res.status(500).json({ error: "Lỗi khi đăng ký", details: error.message });
        }
    },

    activateAccount: async (req, res) => {
        const { token } = req.query;

        if (!token) return res.status(400).json({ error: "Thiếu token" });

        const user = await User.findOne({ where: { remember_token: token } });

        if (!user) return res.status(400).json({ error: "Token không hợp lệ hoặc đã hết hạn" });

        user.remember_token = null;
        user.email_verified_at = new Date();

        await user.save();

        res.json({ message: "Tài khoản đã được kích hoạt thành công!" });
    },

    loginUser: async (req, res) => {
        try {
            const { email, mat_khau } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ error: "Sai email hoặc mật khẩu" });

            const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
            if (!isMatch) return res.status(400).json({ error: "Sai email hoặc mật khẩu" });

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                secretKey,
                { expiresIn: "7d" }
            );

            res.json({ message: "Đăng nhập thành công", token, user });
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi đăng nhập" });
        }
    },

    getUserInfo: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ error: "Không tìm thấy người dùng" });
            }
            res.json(user);
        } catch (err) {
            console.error("Lỗi khi lấy thông tin người dùng:", err);
            res.status(500).json({ error: "Lỗi server" });
        }
    },

    updateUserInfo: async (req, res) => {
        try {
            const { ho_ten, so_dien_thoai, dia_chi } = req.body;
            const anh_dai_dien = req.file ? req.file.filename : undefined;

            const updateData = { ho_ten, so_dien_thoai, dia_chi };
            if (anh_dai_dien) {
                updateData.anh_dai_dien = anh_dai_dien;
            }

            await User.update(updateData, {
                where: { id: req.user.id }
            });

            const updatedUser = await User.findByPk(req.user.id);
            res.json({ message: "Cập nhật thành công", user: updatedUser });
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            res.status(500).json({ error: "Lỗi khi cập nhật thông tin người dùng" });
        }
    },

    
};

module.exports = userController;