const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ho_ten: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mat_khau: { type: DataTypes.STRING, allowNull: false },
    dia_chi: { type: DataTypes.STRING, allowNull: true },
    so_dien_thoai: { type: DataTypes.STRING, allowNull: true },
    anh_dai_dien: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    remember_token: { type: DataTypes.STRING, allowNull: true },
    email_verified_at: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: false, tableName: "users" });

module.exports = User;