const Guild = require('./models/guild');
const User = require('./models/user');
const Message = require('./models/message');
const UserMessage = require('./models/userMessage');

Guild.sync({force:true});
Guild.sync({alter:true});

User.sync({force:true});
User.sync({alter:true});

Message.sync({force:true});
Message.sync({alter:true});

UserMessage.sync({force:true});
UserMessage.sync({alter:true});