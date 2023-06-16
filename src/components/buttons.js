const {Status} = require('../../models/enums');
const { 
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

const row = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
            .setLabel(Status.TANK) // label of the button
            .setStyle(ButtonStyle.Primary)
            .setCustomId(Status.TANK),

        new ButtonBuilder()
            .setLabel(Status.DPS) // label of the button
            .setStyle(ButtonStyle.Danger)
            .setCustomId(Status.DPS), 
            
        new ButtonBuilder()
            .setLabel(Status.HEALER) // label of the button
            .setStyle(ButtonStyle.Success)
            .setCustomId(Status.HEALER),
             
    ]      
);

const row2 = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
            .setLabel(Status.ANY) // label of the button
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(Status.ANY),
                         
        new ButtonBuilder()
            .setLabel(Status.ABSANCE) // label of the button
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(Status.ABSANCE),
    ]      
);
module.exports = {row,row2};