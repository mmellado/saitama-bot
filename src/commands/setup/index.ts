import Discord, { CollectorFilter, Message } from 'discord.js';
import { setServerSettings } from '../../controllers/server';
import colors from '../../utils/colors';
import { CommandPromise } from '../types';

import configurePrefix from './configurePrefix';
import configureModRoles from './configureModRoles';
import configureChannel from './configureChannel';

const setup: CommandPromise = async (server, message) => {
  try {
    const settings = { ...server };
    const serverId = message.guild?.id as string;

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
      .setColor(colors.blue)
      .setTitle(':one: Setup - Moderator Roles')
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
      .setColor(colors.blue)
      .setTitle(':two: Setup - Prefix')
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
        .setColor(colors.yellow)
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
      .setColor(colors.blue)
      .setTitle(':three: Setup - Announcements channel')
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
        .setColor(colors.yellow)
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
      .setColor(colors.blue)
      .setTitle(':four: Setup - Codes channel')
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
        .setColor(colors.yellow)
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
      .setColor(colors.blue)
      .setTitle(':five: Setup - Requests channel')
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
        .setColor(colors.yellow)
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
    embed
      .setColor(colors.green)
      .setTitle(':white_check_mark: Setup - Success!')
      .setDescription('The setup is complete')
      .addFields(
        {
          name: 'Mod roles',
          value: settings.modRoles.map((r) => `<@&${r}>`).join(', '),
        },
        {
          name: 'Prefix',
          value: `\`${settings.prefix}\``,
        },
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
