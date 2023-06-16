
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const {
  Client,
  IntentsBitField,
} = require('discord.js');
require('dotenv').config();

const Guild = require('../models/guild');
const User = require('../models/user');
const Message = require('../models/message');
const UserMessage = require('../models/userMessage');

const { row, row2 } = require('./components/buttons');
const embeddedMessage = require('./components/embeded_message');
const embeddedMention = require('./components/embeded_mention');
const embeddedHelp = require('./components/embeded_help');

const dbOp = require('../utils/db_mngmnt');
const { EventStatus, Status } = require('../models/enums');



const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],
});
const prefix = '!';
const processedMessages = new Set();

const activities_list = [
  { type: 'Playing', message: 'Steal the Potato' },
  { type: 'Playing', message: 'Eat the Potato' },
  { type: 'Playing', message: 'Share the Potato' }
];

client.on('ready', () => {
  console.log('Bot Ready');
  client.guilds.cache.forEach((guild) => {
    //console.log(guild.channels);
    dbOp(Guild, { id: guild.id }, { id: guild.id });
  });
  setInterval(() => {
    const index = Math.floor(Math.random() * activities_list.length);

    client.user.setActivity(activities_list[index].message);
  }, 10000);
  checkForPosts();

});

client.on('guildCreate', (guild) => {
  const channel = guild.systemChannel;
  if (channel) {
    channel.send({ embeds: [embeddedHelp()], components: [] })
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.guild) {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const eventDetails = args.join(' ');
    if (command === 'setchannel') {
      const newChannelId = eventDetails.replace(/[<>#]/g, '');
      dbOp(Guild, { id: message.guild.id }, { id: message.guild.id, eventChannelId: newChannelId });
      message.reply("Schedules will now be sent to " + `<#${newChannelId}>`);

    } else
      if (command === 'endevent') {
        Message.findOne({ where: { id: eventDetails } }).then(async (msg) => {
          await endEvent(msg, false);
          message.reply("Event Ended!!");
        }).catch((e) => {
          message.reply("Event not found!!");

        });
      } else
        if (command === 'help') {
          message.reply({ embeds: [embeddedHelp()], components: [] })
        } else
          if (command === 'schedule') {
            try {
              const eventDetailList = eventDetails.split(';');
              if (eventDetailList.length > 3 || eventDetailList.length < 3) {
                message.channel.send(`<@${message.author.id}>` + " Error with command syntax!!");
                return;
              }
              const title = eventDetailList[0].trim();
              const date = eventDetailList[1].trim();
              const desc = eventDetailList[2].trim();

              if (title === '' || date === '' || desc === '') {
                message.channel.send(`<@${message.author.id}>` + " Error with command syntax!!");
                return;
              }


              const embed = embeddedMessage(
                '',
                title,
                desc,
                '',
                '',
                EventStatus.RECRUITING,
                [],
                [],
                [],
                [],
                []
              );

              processMessage({ authorName: message.author.username, authorId: message.author.id },
                message, { embeds: [embed], components: [row, row2] }, false, title, desc, date);

            } catch (e) {
              console.log('An error occurred:', e);
              message.channel.send("An Error has occered");
            }
          }
  }
});

async function processMessage(passedEventMessage, message, embedObj, update, title = '', desc = '', date = '') {
  try {
    const m = async (msg) => {
      if (!update) {
        var eventMessage = await dbOp(Message, { id: msg.id }, {
          id: msg.id,
          eventStatus: EventStatus.RECRUITING,
          channelId: msg.channelId,
          autherName: passedEventMessage.authorName,
          autherId: passedEventMessage.authorId,
          title: title,
          desc: desc,
          dueDate: new Date(date)
        }, true);

        await setupListeners(msg, eventMessage);

        const newEmbed = embeddedMessage(
          eventMessage.id,
          eventMessage.title,
          eventMessage.desc,
          eventMessage.autherName,
          eventMessage.dueDate,
          EventStatus.RECRUITING,
          [],
          [],
          [],
          [],
          []
        );

        processMessage(eventMessage, msg, { embeds: [newEmbed], components: [row, row2] }, true);

      }
    };
    if (update) {
      client.channels.fetch(passedEventMessage.channelId)
        .then(channel => channel.messages.fetch(passedEventMessage.id))
        .then(message => {
          message.edit(embedObj).then(m).catch((e) => {
            console.log('message not found');
          });
        }).catch((e) => {
          console.log('message not found');
        });
    } else {
      var guild = await Guild.findOne({ where: { id: message.guild.id } });
      client.channels.fetch(guild.eventChannelId == null ? message.channelId : guild.eventChannelId)
        .then(channel => { channel.send(embedObj).then(m); }).catch((e) => {
          console.log('guild not found');
        });;;
    }

  } catch (e) {
    console.log('An error occurred:', e.message);
    message.channel.send("An Error has occered");
  }
}

async function checkForPosts() {
  try {
    var messages = await Message.findAll({ where: { eventStatus: EventStatus.RECRUITING } });
    messages.forEach(async (msg) => {
      if (Date.now() >= msg.dueDate) {
        await endEvent(msg, true);
      } else if (!processedMessages.has(msg.id)) {
        await client.channels.fetch(msg.channelId)
          .then(async channel => await channel.messages.fetch(msg.id))
          .then(async message => {
            await setupListeners(message, msg);
          }).catch(async (e) => {
            await Message
              .destroy({ where: { id: msg.id } });
            console.log('message not found');
          });
      }
    });
  } catch (e) {
    console.log('An error occurred:', e.message);
  }
  setTimeout(checkForPosts, 30000);
}

async function setupListeners(msg, eventMessage) {
  processedMessages.add(msg.id);
  const filter = (interaction) => true;

  const collector = msg.createMessageComponentCollector({ filter });



  collector.on('collect', async (interaction) => {
    if (interaction.isButton()) {

      const user = interaction.user;
      const btn_id = interaction.customId;
      await dbOp(User, { id: user.id }, { id: user.id, name: user.username });

      await await UserMessage
        .findOne({ where: { id: user.id + eventMessage.id } })
        .then(async function(foundItem) {
          if (!foundItem) {
            // Item not found, create a new one
            return await UserMessage
              .create({ id: user.id + eventMessage.id, userId: user.id, messageId: eventMessage.id, playerStatus: btn_id })
              .then(function(item) { return item; });
          } else if (foundItem.playerStatus == btn_id) {
            return await UserMessage
              .destroy({ where: { id: user.id + eventMessage.id } });
          } else {
            return await UserMessage
              .update({ userId: user.id, messageId: eventMessage.id, playerStatus: btn_id },
                { where: { id: user.id + eventMessage.id } })
              .then(function(item) { return item; });
          }

        });

      var clickedUsers = await User.findAll({
        include: [
          {
            model: UserMessage,
            where: { messageId: eventMessage.id },
            attributes: ['playerStatus']
          },
        ],
      });

      const tanks = clickedUsers.
        filter((u) => u.userMessages[0].playerStatus == Status.TANK).
        map((u) => `<@${u.id}>`.toString());

      const dpss = clickedUsers.
        filter((u) => u.userMessages[0].playerStatus == Status.DPS).
        map((u) => `<@${u.id}>`.toString());

      const healers = clickedUsers.
        filter((u) => u.userMessages[0].playerStatus == Status.HEALER).
        map((u) => `<@${u.id}>`.toString());

      const anys = clickedUsers.
        filter((u) => u.userMessages[0].playerStatus == Status.ANY).
        map((u) => `<@${u.id}>`.toString());

      const absances = clickedUsers.
        filter((u) => u.userMessages[0].playerStatus == Status.ABSANCE).
        map((u) => `<@${u.id}>`.toString());



      const embed = embeddedMessage(
        eventMessage.id,
        eventMessage.title,
        eventMessage.desc,
        eventMessage.autherName,
        eventMessage.dueDate,
        EventStatus.RECRUITING,
        tanks,
        dpss,
        healers,
        anys,
        absances
      );
      interaction.deferUpdate();

      processMessage(eventMessage, msg, { embeds: [embed], components: [row, row2] }, true);
      console.log(`User ${user.tag} clicked the button.`);
      // Do something with the user who clicked the button
    }
  });
}

async function endEvent(msg, showMentions) {
  await dbOp(Message, { id: msg.id }, {
    id: msg.id,
    eventStatus: EventStatus.FINISHED,
    channelId: msg.channelId,
    autherName: msg.authorName,
    autherId: msg.authorId,
    title: msg.title,
    desc: msg.desc,
    dueDate: msg.dueDate
  });
  var clickedUsers = await User.findAll({
    include: [
      {
        model: UserMessage,
        where: { messageId: msg.id },
        attributes: ['playerStatus']
      },
    ],
  });

  const tanks = clickedUsers.
    filter((u) => u.userMessages[0].playerStatus == Status.TANK).
    map((u) => `<@${u.id}>`.toString());

  const dpss = clickedUsers.
    filter((u) => u.userMessages[0].playerStatus == Status.DPS).
    map((u) => `<@${u.id}>`.toString());

  const healers = clickedUsers.
    filter((u) => u.userMessages[0].playerStatus == Status.HEALER).
    map((u) => `<@${u.id}>`.toString());

  const anys = clickedUsers.
    filter((u) => u.userMessages[0].playerStatus == Status.ANY).
    map((u) => `<@${u.id}>`.toString());

  const absances = clickedUsers.
    filter((u) => u.userMessages[0].playerStatus == Status.ABSANCE).
    map((u) => `<@${u.id}>`.toString());



  const embed = embeddedMessage(
    msg.id,
    msg.title,
    msg.desc,
    msg.autherName,
    '',
    EventStatus.FINISHED,
    tanks,
    dpss,
    healers,
    anys,
    absances
  );

  await client.channels.fetch(msg.channelId)
    .then(async channel => await channel.messages.fetch(msg.id))
    .then(async message => {
      await message.edit({ embeds: [embed], components: [] }).catch((e) => {
        console.log('message not found');
      });;;
      var eMent = embeddedMention(
        msg.id,
        msg.title,
        msg.autherName,
        [...tanks, ...dpss, ...healers, ...anys]
      );
      if (showMentions)
        await message.channel.send({ embeds: [eMent], components: [] }).catch((e) => {
          console.log('message not found');
        });;;
    });
}

client.login(
  process.env.TOKEN
);