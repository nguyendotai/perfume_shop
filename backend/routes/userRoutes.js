const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, "anh_dai_dien_" + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });
const router = express.Router();

router.post("/dangky", upload.single("anh_dai_dien"), userController.registerUser);
router.get("/kichhoat", userController.activateAccount);
router.post("/dangnhap", userController.loginUser);
router.get("/user-info", authMiddleware, userController.getUserInfo);
router.put("/user-info", authMiddleware, upload.single("anh_dai_dien"), userController.updateUserInfo);

module.exports = router;