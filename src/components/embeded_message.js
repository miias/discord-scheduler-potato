const {Status,EventStatus} = require('../../models/enums');
const { 
    EmbedBuilder, 
} = require('discord.js');

function getEmbeded(raidId,title,desc,author,raidTime,eventStatus,tanks,dpss,healers,anys,absances){

    var t = tanks.length === 0 ? '\u200B' : tanks.join('\n').toString();
    var d = dpss.length === 0 ? '\u200B' : dpss.join('\n').toString();
    var h = healers.length === 0 ? '\u200B' : healers.join('\n').toString();
    var an = anys.length === 0 ? '\u200B' :anys.join('\n').toString();
    var ab = absances.length === 0 ? '\u200B' :absances.join('\n').toString();
    var time =raidTime==''?'\u200B':`<t:${(raidTime.getTime() / 1000).toString()}:R>`;
    return new EmbedBuilder()
    .setColor(eventStatus === EventStatus.RECRUITING ? '#0099FF' : '#880808')
    .setTitle(title ==''?'\u200B':title)
    .setAuthor({name:'by:  ' + author+ '  - EventID: ' + raidId})
    .setDescription(desc==''?'\u200B':desc)
    .addFields(
      { name: 'Potato Team:', value: eventStatus },
      { name: '\u200B', value: '\u200B' },
      { name: 'Raid Time:', value: time },
      { name: '\u200B', value: '\u200B' },
      { name: Status.TANK + ' 2/' + tanks.length, value:t, inline: true },
      { name: Status.DPS + ' 4/' + dpss.length, value:d, inline: true },
      { name: Status.HEALER + ' 2/' + healers.length, value:h, inline: true },
    )
     .addFields(
		{ name: Status.ANY+" "+anys.length, value:an, inline: true },		
        { name: Status.ABSANCE+" "+absances.length, value:ab, inline: true },
	)
	.setTimestamp()
    .setFooter({text:'Made by ChuChu :3'});
}

module.exports = getEmbeded;