import Discord, {
  CollectorFilter,
  Message,
  TextChannel,
  GuildMember,
} from 'discord.js';
import { CommandPromise } from './types';
import isModUser from '../utils/isModUser';
import colors from '../utils/colors';

const code: CommandPromise = async (server, message, args) => {
  try {
    if (!isModUser(server, message.member as GuildMember)) {
      return;
    }

    const conversationEmbed = new Discord.MessageEmbed()
      .setColor(colors.red)
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
      .setColor(colors.blue)
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
      .setColor(colors.green)
      .setTitle(':white_check_mark: Create new code - Success!')
      .setDescription(`Code posted to <#${server.codeChannel}>`);

    const embed = new Discord.MessageEmbed()
      .setColor(colors.blue)
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
