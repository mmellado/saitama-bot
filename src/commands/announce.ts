import Discord, { TextChannel, GuildMember } from 'discord.js';
import { CommandPromise } from './types';
import isModUser from '../utils/isModUser';
import colors from '../utils/colors';

const announce: CommandPromise = async (server, message, args) => {
  try {
    if (!isModUser(server, message.member as GuildMember)) {
      return;
    }

    const conversationEmbed = new Discord.MessageEmbed()
      .setColor(colors.red)
      .setTitle(':no_entry: Post announcement - Error!')
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
      .setColor(colors.green)
      .setTitle(':white_check_mark: Post announcement - Success!')
      .setDescription(`Message posted to <#${server.announceChannel}>`);

    const embed = new Discord.MessageEmbed()
      .setColor(colors.blue)
      .setDescription(announcement);

    await announcementChannel.send(embed);
    await message.channel.send(conversationEmbed);
  } catch (err) {
    console.error('Error on announce.ts', err);
  }
};

export default announce;
