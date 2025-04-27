const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('perfume_shop', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;