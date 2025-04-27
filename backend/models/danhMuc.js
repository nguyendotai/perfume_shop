const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const DanhMuc = sequelize.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_danh_muc: { type: DataTypes.STRING, allowNull: false },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 1 },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
}, { timestamps: false, tableName: 'categories' });

module.exports = DanhMuc;