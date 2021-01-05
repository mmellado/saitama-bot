import dotenv from 'dotenv';

import Discord, { TextChannel, Role, Collection } from 'discord.js';
import { CommandPromise } from './types';
import isAdminUser from '../utils/isAdminUser';

dotenv.config();

const announce: CommandPromise = async (server, message, args) => {
  try {
    if (!isAdminUser(message.member?.roles.cache as Collection<string, Role>)) {
      return;
    }

    const conversationEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Post announcement - Error!')
      .setDescription(
        `Please include a message to post to <#${server.announceChannel}>`
      );

    if (!args?.length) {
      message.channel.send(conversationEmbed);
      return;
    }

    const announcement = message.content.slice(server.prefix.length + 9);
    const announcementChannel = message.client.channels.cache.get(
      server.announceChannel
    ) as TextChannel;

    conversationEmbed
      .setColor('#00ff00')
      .setTitle('Post announcement - Success!')
      .setDescription(`Message posted to <#${server.announceChannel}>`);

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setDescription(announcement);

    await announcementChannel.send(embed);
    await message.channel.send(conversationEmbed);
  } catch (err) {
    console.error('Error on announce.ts', err);
  }
};

export default announce;
