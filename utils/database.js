const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB,process.env.DBU,process.env.DBP,{
    dialect:'sqlite',
    host:'localhost',
    storage:'database.sqlite',
    logging:false
});

module.exports = sequelize;