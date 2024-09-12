const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); // `sequelize` o‘rnatilgan joy

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING
    },
    cardNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = User;
