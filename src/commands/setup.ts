import Discord, { CollectorFilter, Message } from 'discord.js';
import { CommandPromise } from './types';
import { getServerSettings, setServerSettings } from '../controllers/server';
import { Settings as ServerSettings } from '../models/server';
import initialSettings from '../defaultSettings';

const setup: CommandPromise = async (client, message) => {
  try {
    if (!message.member?.hasPermission('ADMINISTRATOR')) {
      return;
    }

    // Current server setting
    const serverId = message.guild?.id as string;
    const defaultChannelId = client.channels.cache.first()?.id;
    const storedSettings = await getServerSettings(serverId);
    const settings: ServerSettings =
      !storedSettings || storedSettings.error
        ? {
            ...initialSettings,
            announceChannel: defaultChannelId,
            codeChannel: defaultChannelId,
            requestChannel: defaultChannelId,
          }
        : storedSettings;

    // Message filters
    const genericFilteer: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id;
    const yesNoFiler: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id &&
      (response.content.toLocaleLowerCase() === 'y' ||
        response.content.toLocaleLowerCase() === 'n');

    // Main bot response content
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Setup Prefix')
      .setDescription(
        `The current prefix for commands is \`${settings.prefix}\`. Would you like to update it? (\`y\`/\`n\`)`
      );

    // The actual message object to be manipulated
    const prompt = await message.channel.send(embed);
    const answer = await message.channel.awaitMessages(yesNoFiler, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    answer.first()?.delete();

    // Update the prefix if needed
    if (answer.first()?.content.toLocaleLowerCase() === 'y') {
      embed.setDescription(
        'Please enter the new prefix. It should be no longer than 2 characters.'
      );
      await prompt.edit(embed);
      let prefix = await message.channel.awaitMessages(genericFilteer, {
        max: 1,
        time: 30000,
        errors: ['time'],
      });
      while (
        !prefix.first()?.content ||
        (prefix.first()?.content as string).length > 2
      ) {
        prefix.first()?.delete();
        embed
          .setColor('#ff0000')
          .setDescription(
            'A prefix is required. It should be no longer than 2 characters.'
          );
        // eslint-disable-next-line no-await-in-loop
        await prompt.edit(embed);
        // eslint-disable-next-line no-await-in-loop
        prefix = await message.channel.awaitMessages(genericFilteer, {
          max: 1,
          time: 30000,
          errors: ['time'],
        });
      }
      settings.prefix = prefix.first()?.content;
      prefix.first()?.delete();
    }

    console.log(settings);
    await setServerSettings(serverId, settings);
    embed
      .setColor('#00ff00')
      .setTitle('Success')
      .setDescription('The setup is complete');
    await prompt.edit(embed);
  } catch (err) {
    console.error(err);
  }
};

export default setup;
