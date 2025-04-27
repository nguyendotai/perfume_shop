const DanhMuc = require('../models/danhMuc');

const danhMucController = {
    getAllDanhMucs: async (req, res) => {
        try {
            const danhMucArr = await DanhMuc.findAll({
                where: { an_hien: 1 },
                order: [['id', 'ASC']]
            });
            res.json(danhMucArr);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục", error });
        }
    },

    createDanhMuc: async (req, res) => {
        const { ten_danh_muc, an_hien } = req.body;
        try {
            const newDanhMuc = await DanhMuc.create({
                ten_danh_muc,
                an_hien: an_hien || 1,
            });
            res.status(201).json(newDanhMuc);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi thêm danh mục", error });
        }
    },

    updateDanhMuc: async (req, res) => {
        const { id } = req.params;
        const { ten_danh_muc, an_hien } = req.body;

        try {
            const danhMuc = await DanhMuc.findByPk(id);

            if (!danhMuc) {
                return res.status(404).json({ message: "Danh mục không tồn tại" });
            }

            danhMuc.ten_danh_muc = ten_danh_muc || danhMuc.ten_danh_muc;
            danhMuc.an_hien = an_hien !== undefined ? an_hien : danhMuc.an_hien;

            await danhMuc.save();
            res.json(danhMuc);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi sửa danh mục", error });
        }
    },

    deleteDanhMuc: async (req, res) => {
        const { id } = req.params;

        try {
            const danhMuc = await DanhMuc.findByPk(id);

            if (!danhMuc) {
                return res.status(404).json({ message: "Danh mục không tồn tại" });
            }

            await danhMuc.destroy();
            res.status(200).json({ message: "Danh mục đã được xóa thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi xóa danh mục", error });
        }
    },

    getDanhMucById: async (req, res) => {
        const danhMuc = await DanhMuc.findByPk(req.params.id);
        res.json(danhMuc);
    }
};

module.exports = danhMucController;