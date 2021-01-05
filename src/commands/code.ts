import dotenv from 'dotenv';

import Discord, {
  CollectorFilter,
  Message,
  TextChannel,
  Role,
  Collection,
} from 'discord.js';
import { CommandPromise } from './types';
import isAdminUser from '../utils/isAdminUser';

dotenv.config();

const code: CommandPromise = async (server, message, args) => {
  try {
    if (!isAdminUser(message.member?.roles.cache as Collection<string, Role>)) {
      return;
    }

    const conversationEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Create new code - Error!')
      .setDescription('A code is needed to use this command');

    if (!args?.length) {
      message.channel.send(conversationEmbed);
      return;
    }

    const newCode = args[0];

    const filter: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id;

    conversationEmbed
      .setColor('#0099ff')
      .setTitle('Create new code')
      .setDescription("Please specify the code's reward");

    const prompt = await message.channel.send(conversationEmbed);
    const reply = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    await reply.first()?.delete();

    const reward = reply.first()?.content || 'Error fetchign reward';
    const replyChannel = message.client.channels.cache.get(
      server.codeChannel
    ) as TextChannel;

    conversationEmbed
      .setColor('#00ff00')
      .setTitle('Create new code - Success!')
      .setDescription(`Code posted to <#${server.codeChannel}>`);

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('New Code!')
      .setDescription(newCode)
      .addField('Reward', reward)
      .setTimestamp();

    await replyChannel.send(embed);
    await prompt.edit(conversationEmbed);
  } catch (err) {
    console.error('Error on codes.ts', err);
  }
};

export default code;
