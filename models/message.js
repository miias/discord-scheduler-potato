const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

const Message = sequelize.define('message',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true
    },
    eventStatus:{
        type:Sequelize.STRING,
        allowNull:false
    },
    channelId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    autherName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    autherId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    title:{
        type:Sequelize.STRING,
        allowNull:true
    },
    desc:{
        type:Sequelize.STRING,
        allowNull:true
    },
    dueDate:{
        type:Sequelize.DATE,
        allowNull:false
    },

});

User.belongsToMany(Message, { through: 'userMessage' });
Message.belongsToMany(User, { through: 'userMessage' });

module.exports = Message;