import Discord, { CollectorFilter, Message } from 'discord.js';
import { CommandPromise } from './types';
import { getServerSettings } from '../controllers/server';
import defaultSettings from '../defaultSettings';

const setup: CommandPromise = async (client, message) => {
  try {
    if (!message.member?.hasPermission('ADMINISTRATOR')) {
      return;
    }

    console.log(client.channels.cache.first());

    const updated = {
      modRoles: false,
      prefix: false,
      announceChannel: false,
      codeChannel: false,
      requestChannel: false,
    };

    const settings = await getServerSettings(message.guild?.id as string);
    const genericFilteer: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id;
    const yesNoFiler: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id &&
      (response.content.toLocaleLowerCase() === 'y' ||
        response.content.toLocaleLowerCase() === 'n');

    const embed = new Discord.MessageEmbed()
      .setTitle('Setup Prefix')
      .setDescription(
        `The inisital prefix for the different commands is \`${
          settings.prefix || defaultSettings.prefix
        }\`. Would you like to update it? (\`y\`/\`n\`)`
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
      updated.prefix = true;
      console.log(prefix.first()?.content);
    }
  } catch (err) {
    console.error(err);
  }
};

export default setup;
