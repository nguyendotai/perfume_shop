const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const DonHang = sequelize.define('orders', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    ngay_dat: { type: DataTypes.DATE},
    trang_thai: { type: DataTypes.ENUM('Đang xử lí', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'), defaultValue: 'Chò xác nhận' },
    tong_tien: { type:DataTypes.DECIMAL },
    phuong_thuc_thanh_toan:{ type:DataTypes.STRING },
    voucher: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
}, { timestamps:false, tableName: 'orders' })

DonHang.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'users'
});

module.exports = DonHang;