import Discord, { CollectorFilter, Message } from 'discord.js';
import { CommandPromise } from '../types';
import { getServerSettings, setServerSettings } from '../../controllers/server';
import { Settings as ServerSettings } from '../../models/server';
import initialSettings from '../../defaultSettings';

import configurePrefix from './configurePrefix';

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
    const genericFilter: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id;
    const yesNoFilter: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id &&
      (response.content.toLocaleLowerCase() === 'y' ||
        response.content.toLocaleLowerCase() === 'n');

    /** ***********************************************************************
     *                                 PREFIX                                 *
     ************************************************************************ */
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Setup Prefix')
      .setDescription(
        `The current prefix for commands is \`${settings.prefix}\`. Would you like to update it? (\`y\`/\`n\`)`
      );
    const prompt = await message.channel.send(embed);
    const answer = await message.channel.awaitMessages(yesNoFilter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    answer.first()?.delete();

    if (answer.first()?.content.toLocaleLowerCase() === 'y') {
      settings.prefix = await configurePrefix(
        message,
        prompt,
        embed,
        genericFilter
      );
    }
    /** ***********************************************************************
     *                              PREFIX END                                *
     ************************************************************************ */

    console.log(settings);
    await setServerSettings(serverId, settings);
    await embed
      .setColor('#00ff00')
      .setTitle('Success')
      .setDescription('The setup is complete');
    await prompt.edit(embed);
  } catch (err) {
    console.error(err);
  }
};

export default setup;
