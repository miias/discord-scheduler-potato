const { Status, EventStatus } = require('../../models/enums');
const {
  EmbedBuilder,
} = require('discord.js');

function getEmbededMentions(raidId, title, author, playersList) {

  var p = playersList.length === 0 ? '\u200B' : playersList.join(' , ').toString();

  return new EmbedBuilder()
    .setColor('#00FFFF')
    .setTitle(title == '' ? '\u200B' : title)
    .setAuthor({ name: 'by :  ' + author + '  - EventID: ' + raidId })
    .setDescription("It's Raid Time!!!")
    .setImage("https://scontent-fra3-1.xx.fbcdn.net/v/t1.18169-9/1924389_892344324126916_8779748521662701405_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=9267fe&_nc_ohc=6YaQZ7GbAkYAX-1U-_b&_nc_ht=scontent-fra3-1.xx&oh=00_AfA99nH0PYrjyJ--x4EqSVF3edBjk8TI4OOAuTSUrvUzeQ&oe=64B2E6FA")
    .setTimestamp()
    .setFooter({ text: 'Made by ChuChu :3' });
}

module.exports = getEmbededMentions;