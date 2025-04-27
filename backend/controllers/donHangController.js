const DonHang = require('../models/order');
const User = require('../models/user');
const Voucher = require('../models/voucher');

const orderController = {
    // Tạo đơn hàng mới
    createOrder: async (req, res) => {
        try {
            const { user_id, ngay_dat, trang_thai, tong_tien, phuong_thuc_thanh_toan } = req.body;

            const newOrder = await DonHang.create({
                user_id,
                ngay_dat: ngay_dat || new Date(),
                trang_thai: trang_thai || 'Chờ xác nhận',
                tong_tien,
                phuong_thuc_thanh_toan,
            });

            res.status(201).json({ message: 'Đơn hàng đã được tạo', order: newOrder });
        } catch (error) {
            console.error('Lỗi tạo đơn hàng:', error);
            res.status(500).json({ error: 'Không thể tạo đơn hàng' });
        }
    },

    // Lấy tất cả đơn hàng
    getAllOrders: async (req, res) => {
        try {
            const orders = await DonHang.findAll({
                include: { model: User, as: 'users' },
                order: [['id', 'DESC']],
            });

            res.status(200).json(orders);
        } catch (error) {
            console.error('Lỗi lấy đơn hàng:', error);
            res.status(500).json({ error: 'Không thể lấy danh sách đơn hàng' });
        }
    },

    // Lấy đơn hàng theo ID
    getOrderById: async (req, res) => {
        try {
            const id = req.params.id;

            const order = await DonHang.findByPk(id, {
                include: { model: User, as: 'users' },
            });

            if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

            res.status(200).json(order);
        } catch (error) {
            console.error('Lỗi lấy đơn hàng theo ID:', error);
            res.status(500).json({ error: 'Không thể lấy đơn hàng' });
        }
    },

    // Cập nhật đơn hàng
    updateOrder: async (req, res) => {
        try {
            const id = req.params.id;
            const { trang_thai, tong_tien, phuong_thuc_thanh_toan } = req.body;

            const order = await DonHang.findByPk(id);
            if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

            order.trang_thai = trang_thai || order.trang_thai;
            order.tong_tien = tong_tien || order.tong_tien;
            order.phuong_thuc_thanh_toan = phuong_thuc_thanh_toan || order.phuong_thuc_thanh_toan;

            await order.save();

            res.status(200).json({ message: 'Đã cập nhật đơn hàng', order });
        } catch (error) {
            console.error('Lỗi cập nhật đơn hàng:', error);
            res.status(500).json({ error: 'Không thể cập nhật đơn hàng' });
        }
    },

    // Xóa đơn hàng
    deleteOrder: async (req, res) => {
        try {
            const id = req.params.id;
            const order = await DonHang.findByPk(id);
            if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

            await order.destroy();
            res.status(200).json({ message: 'Đã xóa đơn hàng' });
        } catch (error) {
            console.error('Lỗi xóa đơn hàng:', error);
            res.status(500).json({ error: 'Không thể xóa đơn hàng' });
        }
    },

    // Thanh toán đơn hàng
    payOrder: async (req, res) => {
        try {
            const id = req.params.id;
            const { phuong_thuc_thanh_toan } = req.body; // Phương thức thanh toán (COD, Thẻ tín dụng, ...)

            // Kiểm tra nếu đơn hàng không tồn tại
            const order = await DonHang.findByPk(id);
            if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

            // Kiểm tra trạng thái đơn hàng trước khi thanh toán (phải là "Chờ xác nhận")
            if (order.trang_thai !== 'Chờ xác nhận') {
                return res.status(400).json({ error: 'Đơn hàng không thể thanh toán vì trạng thái không phù hợp' });
            }

            // Cập nhật phương thức thanh toán và thay đổi trạng thái đơn hàng
            order.phuong_thuc_thanh_toan = phuong_thuc_thanh_toan || order.phuong_thuc_thanh_toan;
            order.trang_thai = 'Đã xác nhận';  // Ví dụ: thay đổi trạng thái sau khi thanh toán

            // Lưu lại thay đổi
            await order.save();

            // Trả về kết quả
            res.status(200).json({ message: 'Thanh toán thành công', order });
        } catch (error) {
            console.error('Lỗi thanh toán:', error);
            res.status(500).json({ error: 'Không thể thanh toán đơn hàng' });
        }
    },

    // Kiểm tra voucher
    checkVoucher: async (req, res) => {
        const { voucher_code, total_amount } = req.body;

        // Kiểm tra nếu voucher_code không tồn tại hoặc rỗng

        if (total_amount <= 0) {
            return res.status(400).json({ error: 'Tổng tiền đơn hàng không hợp lệ' });
        }

        try {
            // Kiểm tra voucher trong database
            const voucher = await Voucher.findOne({ where: { code: voucher_code } });

            if (!voucher) {
                return res.status(400).json({ error: 'Voucher không hợp lệ.' });
            }

            // Kiểm tra hạn sử dụng
            if (new Date() > new Date(voucher.expiration_date)) {
                return res.status(400).json({ error: 'Voucher đã hết hạn.' });
            }

            // Tính toán mức giảm
            let discount = 0;
            let final_amount = total_amount;

            if (voucher.discount_type === 'percentage') {
                // Giảm theo phần trăm
                discount = total_amount * (voucher.discount / 100);
                final_amount = total_amount - discount;
            } else if (voucher.discount_type === 'fixed') {
                // Giảm theo số tiền cố định
                discount = voucher.discount;
                final_amount = total_amount - discount;
            }

            // Đảm bảo tổng tiền không bị âm
            final_amount = final_amount > 0 ? final_amount : 0;

            res.json({
                message: "Voucher hợp lệ. Giảm giá thành công.",
                discount,
                final_amount
            });
        } catch (error) {
            console.error("Lỗi khi kiểm tra voucher:", error);
            res.status(500).json({ error: 'Lỗi server khi kiểm tra voucher' });
        }
    }



};

module.exports = orderController;
