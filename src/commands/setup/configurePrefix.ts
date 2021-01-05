import { CollectorFilter, Message, MessageEmbed } from 'discord.js';
import { Settings as ServerSettings } from '../../models/server';
import colors from '../../utils/colors';

export default async (
  message: Message,
  prompt: Message,
  embed: MessageEmbed,
  filter: CollectorFilter,
  settings: ServerSettings
): Promise<string> => {
  try {
    embed.setDescription(
      'Please enter the new prefix. It should be no longer than 2 characters.'
    );
    await prompt.edit(embed);
    let prefix = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    while (
      !prefix.first()?.content ||
      (prefix.first()?.content as string).length > 2
    ) {
      await prefix.first()?.delete();
      embed
        .setColor(colors.red)
        .setDescription(
          'A prefix is required. It should be no longer than 2 characters.'
        );

      await prompt.edit(embed);

      prefix = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      });
    }
    await prefix.first()?.delete();
    return prefix.first()?.content as string;
  } catch (err) {
    console.error(err);
    return settings.prefix as string;
  }
};
