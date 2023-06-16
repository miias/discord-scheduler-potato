const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

const Guild = sequelize.define('guild',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true
    }
});

Guild.hasMany(User);
User.belongsTo(Guild);

module.exports = Guild;