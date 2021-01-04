import { CollectorFilter, Message, MessageEmbed } from 'discord.js';
import { Settings as ServerSettings } from '../../models/server';

export default async (
  message: Message,
  prompt: Message,
  embed: MessageEmbed,
  filter: CollectorFilter,
  settings: ServerSettings
): Promise<string[]> => {
  try {
    const answer = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    answer.first()?.delete();

    let roleList = answer
      .first()
      ?.mentions.roles.map((_, key) => key) as string[];

    while (!roleList.length) {
      embed
        .setColor('#ff0000')
        .setDescription(
          'You need to appoint at least 1 role as a  Moderator role. Please enter the list of Mod roles by mentioning them using @.'
        );
      await prompt.edit(embed);

      const retry = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      });
      await retry.first()?.delete();

      roleList = retry.first()?.mentions.roles.map((_, key) => key) as string[];
    }

    return roleList;
  } catch (err) {
    console.error(err);
    return settings.modRoles as string[];
  }
};
