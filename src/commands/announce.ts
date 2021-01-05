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
    if (!args?.length) {
      message.channel.send('Please add a message to announce');
      return;
    }

    const announcement = message.content.slice(server.prefix.length + 9);
    const announcementChannel =
      (message.client.channels.cache.find(
        (channel: TextChannel) =>
          channel.name === process.env.ANNOUNCEMENTS_CHANNEL
      ) as TextChannel) || message.channel;

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setDescription(announcement);

    await announcementChannel.send(embed);
  } catch (err) {
    console.error('Error on announce.ts', err);
  }
};

export default announce;
