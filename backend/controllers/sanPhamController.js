const SanPham = require('../models/sanPham');
const DanhMuc = require('../models/danhMuc'); // Import DanhMuc model
const { Op, Sequelize } = require('sequelize');

const sanPhamController = {
    getAllSanPhams: async (req, res) => {
        try {
            const whereCondition = { an_hien: 1 };

            if (req.query.category) {
                whereCondition.danh_muc_id = req.query.category;
            }

            const spArr = await SanPham.findAll({
                where: whereCondition,
                order: [['id', 'ASC']],
                include: [
                    {
                        model: DanhMuc,
                        as: 'danh_muc',
                        attributes: ['ten_danh_muc'],
                    }
                ]
            });

            res.json(spArr);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
        }
    },

    createSanPham: async (req, res) => {
        try {
            const { ten_sp, mo_ta, gia, gia_km, danh_muc_id, an_hien, nam_ra_mat } = req.body;
            const hinh_anh = req.file ? req.file.filename : null;

            if (!ten_sp || !gia || !danh_muc_id) {
                return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
            }

            const newSP = await SanPham.create({
                ten_sp,
                mo_ta,
                gia,
                gia_km,
                danh_muc_id,
                an_hien: an_hien ?? 1,
                nam_ra_mat: nam_ra_mat ?? new Date().getFullYear(),
                hinh_anh
            });

            const { updatedAt, ...productWithoutUpdatedAt } = newSP.toJSON();

            res.json({ message: "Thêm sản phẩm thành công", product: productWithoutUpdatedAt });

        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            res.status(500).json({ error: "Lỗi khi thêm sản phẩm", details: error.message });
        }
    },

    updateSanPham: async (req, res) => {
        try {
            const id = req.params.id;
            const { ten_sp, mo_ta, gia, gia_km, danh_muc_id, an_hien, nam_ra_mat } = req.body;
            const hinh_anh = req.file ? req.file.filename : undefined;

            const updateData = { ten_sp, mo_ta, gia, gia_km, danh_muc_id, an_hien, nam_ra_mat };
            if (hinh_anh) updateData.hinh_anh = hinh_anh;

            const result = await SanPham.update(updateData, { where: { id } });

            if (result[0] === 0) {
                return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
            }

            const updatedSP = await SanPham.findByPk(id);

            if (!updatedSP) {
                return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
            }

            const { createdAt, ...productWithoutCreatedAt } = updatedSP.toJSON();

            res.json({ message: "Cập nhật sản phẩm thành công", product: productWithoutCreatedAt });

        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm", details: error.message });
        }
    },

    deleteSanPham: async (req, res) => {
        try {
            const id = req.params.id;

            const product = await SanPham.findByPk(id);
            if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

            await SanPham.destroy({ where: { id } });
            res.json({ message: "Xóa sản phẩm thành công" });
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            res.status(500).json({ error: "Lỗi khi xóa sản phẩm", details: error.message });
        }
    },

    getSanPhamById: async (req, res) => {
        const sp = await SanPham.findOne({
            where: { id: req.params.id, an_hien: 1 }
        });
        res.json(sp);
    },

    getSanPhamsHot: async (req, res) => {
        const sosp = Number(req.params.sosp) || 12;
        const spArr = await SanPham.findAll({
            where: { an_hien: 1 },
            order: [['gia_km', 'ASC']],
            limit: sosp
        });
        res.json(spArr);
    },

    getSanPhamsMoi: async (req, res) => {
        const sosp = Number(req.params.sosp) || 6;
        const spArr = await SanPham.findAll({
            where: { an_hien: 1 },
            order: [['nam_ra_mat', 'DESC']],
            limit: sosp
        });
        res.json(spArr);
    },

    getSanPhamsTrongDanhMuc: async (req, res) => {
        const danh_muc_id = Number(req.params.id);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        const totalCount = await SanPham.count({
            where: { danh_muc_id, an_hien: 1 }
        });

        const spArr = await SanPham.findAll({
            where: { danh_muc_id, an_hien: 1 },
            order: [['gia', 'ASC']],
            limit,
            offset
        });

        res.json({
            products: spArr,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        });
    },

    getSanPhamsSale: async (req, res) => {
        const sosp = Number(req.params.sosp) || 10;

        try {
            const spArr = await SanPham.findAll({
                where: {
                    gia_km: { [Op.lt]: Sequelize.col("gia") },
                    an_hien: 1
                },
                order: [["gia_km", "ASC"]],
                limit: sosp
            });

            res.json(spArr);
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm sale", details: error.message });
        }
    },

    timKiemSanPhams: async (req, res) => {
        let tu_khoa = req.params.tu_khoa;
        const page = Number(req.params.page) || 1;
        const limit = 9;
        const offset = (page - 1) * limit;

        try {
            const totalCount = await SanPham.count({
                where: {
                    ten_sp: { [Op.substring]: tu_khoa },
                    an_hien: 1
                }
            });

            const spArr = await SanPham.findAll({
                where: {
                    ten_sp: { [Op.substring]: tu_khoa },
                    an_hien: 1
                },
                order: [['gia', 'ASC']],
                limit,
                offset
            });

            res.json({
                products: spArr,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            });
        } catch (error) {
            res.status(500).json({ error: "Lỗi khi tìm kiếm sản phẩm", details: error.message });
        }
    },

    getSanPhamsLienQuan: async (req, res) => {
        const { id } = req.params;

        try {
            const sanPhamHienTai = await SanPham.findOne({
                where: { id, an_hien: 1 }
            });

            if (!sanPhamHienTai) {
                return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
            }

            const spLienQuan = await SanPham.findAll({
                where: {
                    danh_muc_id: sanPhamHienTai.danh_muc_id,
                    id: { [Op.ne]: id },
                    an_hien: 1
                },
                order: [['gia', 'ASC']],
                limit: 7
            });

            res.json(spLienQuan);
        } catch (error)
            {res.status(500).json({ error: "Lỗi khi lấy sản phẩm liên quan", details: error.message });
        }
    }
};

module.exports = sanPhamController;