import Discord, { CollectorFilter, Message } from 'discord.js';
import { CommandPromise } from '../types';
import { getServerSettings, setServerSettings } from '../../controllers/server';
import { Settings as ServerSettings } from '../../models/server';
import initialSettings from '../../defaultSettings';

import configurePrefix from './configurePrefix';
import configureModRoles from './configureModRoles';
import configureChannel from './configureChannel';

const setup: CommandPromise = async (client, message) => {
  try {
    if (!message.member?.hasPermission('ADMINISTRATOR')) {
      return;
    }

    // Current server setting
    const serverId = message.guild?.id as string;
    const defaultChannelId = client.channels.cache.find(
      (channel) => channel.type === 'text'
    )?.id;
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
     *                                 ROLES                                  *
     ************************************************************************ */
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(':one: Moderator Roles')
      .setDescription(
        `Please list the roles to be considered Mods. These will be able to use  Mod commands`
      );
    const prompt = await message.channel.send(embed);

    settings.modRoles = await configureModRoles(
      message,
      prompt,
      embed,
      genericFilter,
      settings
    );

    /** ***********************************************************************
     *                                 PREFIX                                 *
     ************************************************************************ */
    embed
      .setColor('#0099ff')
      .setTitle(':two: Setup Prefix')
      .setDescription(
        `The current prefix for commands is \`${settings.prefix}\`. Would you like to update it? (\`y\`/\`n\`)`
      );
    await prompt.edit(embed);
    const prefixAnswer = await message.channel.awaitMessages(yesNoFilter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    prefixAnswer.first()?.delete();

    if (prefixAnswer.first()?.content.toLocaleLowerCase() === 'y') {
      embed
        .setColor('#ffb84d')
        .setDescription(
          'Please enter the new prefix. It should be no longer than 2 characters.'
        );
      await prompt.edit(embed);
      settings.prefix = await configurePrefix(
        message,
        prompt,
        embed,
        genericFilter,
        settings
      );
    }

    /** ***********************************************************************
     *                     ANNOUNCEMENT CHANNEL                                *
     ************************************************************************ */
    embed
      .setColor('#0099ff')
      .setTitle(':three: Setup Announcements Channel')
      .setDescription(
        `The current Announcements Channels is <#${settings.announceChannel}>. This is used for the ${settings.prefix}announce command to post to. Would you like to update it? (\`y\`/\`n\`)`
      );
    await prompt.edit(embed);
    const announceChannel = await message.channel.awaitMessages(yesNoFilter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    announceChannel.first()?.delete();

    if (announceChannel.first()?.content.toLocaleLowerCase() === 'y') {
      embed
        .setColor('#ffb84d')
        .setDescription('Please tag the new Announcements Channel.');
      await prompt.edit(embed);
      settings.announceChannel = await configureChannel(
        message,
        prompt,
        embed,
        genericFilter,
        settings,
        'announceChannel'
      );
    }

    /** ***********************************************************************
     *                            CODES CHANNEL                                *
     ************************************************************************ */
    embed
      .setColor('#0099ff')
      .setTitle(':four: Setup Codes Channel')
      .setDescription(
        `The current Codes Channels is <#${settings.codeChannel}>. This is used for the ${settings.prefix}code command to post to. Would you like to update it? (\`y\`/\`n\`)`
      );
    await prompt.edit(embed);
    const codeChannel = await message.channel.awaitMessages(yesNoFilter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    codeChannel.first()?.delete();

    if (codeChannel.first()?.content.toLocaleLowerCase() === 'y') {
      embed
        .setColor('#ffb84d')
        .setDescription('Please tag the new Announcements Channel.');
      await prompt.edit(embed);
      settings.codeChannel = await configureChannel(
        message,
        prompt,
        embed,
        genericFilter,
        settings,
        'codeChannel'
      );
    }

    /** ***********************************************************************
     *                        REQUESTS CHANNEL                                *
     ************************************************************************ */
    embed
      .setColor('#0099ff')
      .setTitle(':five: Setup Requests Channel')
      .setDescription(
        `The current Requests Channels is <#${settings.requestChannel}>. This is only channel the ${settings.prefix}request command can be used. Would you like to update it? (\`y\`/\`n\`)`
      );
    await prompt.edit(embed);
    const requestChannel = await message.channel.awaitMessages(yesNoFilter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    });
    requestChannel.first()?.delete();

    if (requestChannel.first()?.content.toLocaleLowerCase() === 'y') {
      embed
        .setColor('#ffb84d')
        .setDescription('Please tag the new Requests Channel.');
      await prompt.edit(embed);
      settings.requestChannel = await configureChannel(
        message,
        prompt,
        embed,
        genericFilter,
        settings,
        'requestChannel'
      );
    }

    /** ***********************************************************************
     *                                  SAVE                                  *
     ************************************************************************ */

    await setServerSettings(serverId, settings);
    await embed
      .setColor('#00ff00')
      .setTitle(':white_check_mark: Success')
      .setDescription('The setup is complete')
      .addFields(
        {
          name: 'Mod roles',
          value: settings.modRoles.map((r) => `<@&${r}>`).join(', '),
        },
        // { name: '\u200B', value: '\u200B' },
        {
          name: 'Announcements channel',
          value: `<#${settings.announceChannel}>`,
        },
        {
          name: 'Codes channel',
          value: `<#${settings.codeChannel}>`,
        },
        {
          name: 'Requests channel',
          value: `<#${settings.requestChannel}>`,
        }
      );
    await prompt.edit(embed);
  } catch (err) {
    console.error(err);
  }
};

export default setup;
