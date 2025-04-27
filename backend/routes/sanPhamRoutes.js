const express = require('express');
const sanPhamController = require('../controllers/sanPhamController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const uploadSP = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/products");
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, "sp_" + uniqueSuffix + ext);
        }
    })
});

const router = express.Router();

router.get('/', sanPhamController.getAllSanPhams);
router.post('/', authMiddleware, uploadSP.single("hinh_anh"), sanPhamController.createSanPham);
router.put('/:id', authMiddleware, uploadSP.single("hinh_anh"), sanPhamController.updateSanPham);
router.delete('/:id', authMiddleware, sanPhamController.deleteSanPham);
router.get('/hot/:sosp?', sanPhamController.getSanPhamsHot);
router.get('/moi/:sosp?', sanPhamController.getSanPhamsMoi);
router.get('/:id', sanPhamController.getSanPhamById);
router.get('/trongdanhmuc/:id', sanPhamController.getSanPhamsTrongDanhMuc);
router.get('/sanphamsale/:sosp?', sanPhamController.getSanPhamsSale);
router.get('/timkiem/:tu_khoa/:page?', sanPhamController.timKiemSanPhams);
router.get('/sanpham-lienquan/:id', sanPhamController.getSanPhamsLienQuan);

module.exports = router;