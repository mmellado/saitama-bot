import Discord, { CollectorFilter, Message } from 'discord.js';
import { CommandPromise } from './types';
import { getServerSettings } from '../controllers/server';
import { Settings as ServerSettings } from '../models/server';
import initialSettings from '../defaultSettings';

const setup: CommandPromise = async (client, message) => {
  try {
    if (!message.member?.hasPermission('ADMINISTRATOR')) {
      return;
    }

    const defaultChannelId = client.channels.cache.first()?.id;

    const defaultSettings: ServerSettings = {
      ...initialSettings,
      announceChannel: defaultChannelId,
      codeChannel: defaultChannelId,
      requestChannel: defaultChannelId,
    };

    const settings =
      (await getServerSettings(message.guild?.id as string)) || defaultSettings;
    const genericFilteer: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id;
    const yesNoFiler: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id &&
      (response.content.toLocaleLowerCase() === 'y' ||
        response.content.toLocaleLowerCase() === 'n');

    const embed = new Discord.MessageEmbed()
      .setTitle('Setup Prefix')
      .setDescription(
        `The current prefix for commands is \`${settings.prefix}\`. Would you like to update it? (\`y\`/\`n\`)`
      );

    const prompt = await message.channel.send(embed);
    const answer = await message.channel.awaitMessages(yesNoFiler, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });

    // Update the prefix if needed
    if (answer.first()?.content.toLocaleLowerCase() === 'y') {
      embed.setDescription(
        'Please enter the new prefix. It should be something short'
      );
      await prompt.edit(embed);
      const prefix = await message.channel.awaitMessages(genericFilteer, {
        max: 1,
        time: 30000,
        errors: ['time'],
      });
      console.log(prefix.first()?.content);
    }
  } catch (err) {
    console.error(err);
  }
};

export default setup;
