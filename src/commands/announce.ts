import dotenv from 'dotenv';

import Discord, { TextChannel, Role, Collection } from 'discord.js';
import { Command } from './types';
import isAdminUser from '../utils/isAdminUser';

dotenv.config();

const announce: Command = (client, message, args) => {
  if (!isAdminUser(message.member?.roles.cache as Collection<string, Role>)) {
    return;
  }
  if (!args?.length) {
    message.channel.send('Please add a message to announce');
    return;
  }

  const announcement = message.content.slice(client.config.prefix.length + 9);
  const announcementChannel =
    (client.channels.cache.find(
      (channel: TextChannel) =>
        channel.name === process.env.ANNOUNCEMENTS_CHANNEL
    ) as TextChannel) || message.channel;
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setDescription(announcement);

  announcementChannel.send(embed);
};

export default announce;
