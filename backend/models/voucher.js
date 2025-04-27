const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Voucher = sequelize.define('voucher', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },   // Mã voucher, duy nhất
    discount: { type: DataTypes.DECIMAL, allowNull: false },            // Giá trị giảm giá
    expiration_date: { type: DataTypes.DATE, allowNull: false },        // Ngày hết hạn
}, { timestamps: false, tableName: 'voucher' });

module.exports = Voucher;
