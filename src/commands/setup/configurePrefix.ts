import { CollectorFilter, Message, MessageEmbed } from 'discord.js';

export default async (
  message: Message,
  prompt: Message,
  embed: MessageEmbed,
  filter: CollectorFilter
): Promise<string> => {
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
      .setColor('#ff0000')
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
};
