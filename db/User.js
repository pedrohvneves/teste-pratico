const Sequelize = require('sequelize');
const database = require('./database');

const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull:false
    },
    descricao: Sequelize.STRING
})


module.exports = User;