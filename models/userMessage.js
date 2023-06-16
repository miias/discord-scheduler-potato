const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');
const Message = require('./message');

const UserMessage = sequelize.define('userMessage',{
    id:{
        type:Sequelize.STRING,
        primaryKey: true,
    },
    playerStatus:{
        type:Sequelize.STRING,
        allowNull:true
    },
});

User.belongsToMany(Message, { through: UserMessage });
Message.belongsToMany(User, { through: UserMessage });
User.hasMany(UserMessage, { foreignKey: 'userId' });
UserMessage.belongsTo(User, { foreignKey: 'userId' });
Message.hasMany(UserMessage, { foreignKey: 'messageId' });
UserMessage.belongsTo(Message, { foreignKey: 'messageId' });
module.exports = UserMessage;