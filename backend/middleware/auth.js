const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key"; // giống như bên đăng nhập

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "Không có token xác thực" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Lưu thông tin user vào req để dùng trong các route sau
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

module.exports = authMiddleware;