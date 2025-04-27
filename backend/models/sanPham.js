const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const DanhMuc = require('./danhMuc'); // Import DanhMuc model

const SanPham = sequelize.define('products', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sp: { type: DataTypes.STRING, allowNull: false },
    mo_ta: { type: DataTypes.TEXT },
    gia: { type: DataTypes.INTEGER },
    gia_km: { type: DataTypes.INTEGER },
    danh_muc_id: { type: DataTypes.INTEGER },
    brand: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    nam_ra_mat: { type: DataTypes.INTEGER },
    nong_do: { type: DataTypes.STRING },
    phong_cach: { type: DataTypes.STRING },
    huong_dau: { type: DataTypes.STRING },
    huong_giua: { type: DataTypes.STRING },
    huong_cuoi: { type: DataTypes.STRING },
    hinh_anh: { type: DataTypes.STRING },
    dung_tich: { type: DataTypes.INTEGER },
    hot: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { timestamps: false, tableName: 'products' });

SanPham.belongsTo(DanhMuc, {
    foreignKey: 'danh_muc_id',
    as: 'danh_muc',
});

module.exports = SanPham;