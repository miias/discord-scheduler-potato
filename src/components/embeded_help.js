const {Status,EventStatus} = require('../../models/enums');
const { 
    EmbedBuilder, 
} = require('discord.js');

function getEmbededHelp(){
    return new EmbedBuilder()
    .setColor('#111111')
    .setTitle('Welcome to Potato Scheduler')
    .setDescription('This bot will help organize raid teams/times.\nThe bot will collect public information provided by Discord, such as usernames, user IDs, and message IDs when talking to the bot.')
    .setThumbnail('https://static.wikia.nocookie.net/shipping/images/3/37/SashaPotato1.png/revision/latest?cb=20191126040335')
    .addFields(
      { name: 'COMMANDS : ', value: '\u200B' },
      { name: '!help', value: 'to get this message' },
      { name: '!setchannel <channel>', value: '!setchannel #general \nUse this Command to instruct the bot on where to post schedule messages.' },
      { name: '!schedule <Title>;<YYYY/MM/DD HH:MM am/pm gmt>;<Description>', value: '!schedule Some Title;2023/6/15 12:00 am gmt+3;some long desc......' },
      { name: '!endevent <EventID>', value: '!endevent 1119013140563251220' },
      { name: '\u200B', value: '\u200B' },

    )
	.setTimestamp()
    .setFooter({text:'Made by ChuChu :3'});
}

module.exports = getEmbededHelp;