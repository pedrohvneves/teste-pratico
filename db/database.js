const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/file/database.sqlite'
  })
 
module.exports = sequelize;