import { CollectorFilter, Message, MessageEmbed } from 'discord.js';
import { Settings as ServerSettings } from '../../models/server';
import colors from '../../utils/colors';

export default async (
  message: Message,
  prompt: Message,
  embed: MessageEmbed,
  filter: CollectorFilter,
  settings: ServerSettings,
  channelKey: string
): Promise<string> => {
  try {
    const answer = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    answer.first()?.delete();

    let channelList = answer
      .first()
      ?.mentions.channels.map((_, key) => key) as string[];

    while (channelList.length !== 1) {
      embed
        .setColor(colors.red)
        .setDescription('You need to specify exactly 1 channel');
      await prompt.edit(embed);

      const retry = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      });
      await retry.first()?.delete();

      channelList = retry
        .first()
        ?.mentions.roles.map((_, key) => key) as string[];
    }

    return channelList[0];
  } catch (err) {
    console.error(err);
    return settings[channelKey] as string;
  }
};
