import Discord, {
  CollectorFilter,
  Message,
  MessageEmbed,
  MessageReaction,
  User,
  TextChannel,
} from 'discord.js';
import colors from '../utils/colors';
import { CommandPromise } from './types';
import heroes from '../utils/heroEmojis';
import { Settings as ServerSettings } from '../models/server';

const handleDataGathering = async (
  embed: MessageEmbed,
  message: Message,
  server: ServerSettings
): Promise<void> => {
  try {
    const heroSelectionFilter: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id &&
      parseInt(response.content, 10) > 0 &&
      parseInt(response.content, 10) <= heroes.length;
    const lenderSelectorFilter: CollectorFilter = (response: Message) =>
      response.author.id === message.author.id &&
      response.mentions.users.map((l) => l.id).length === 1;
    const confirmationFilter: CollectorFilter = (
      reaction: MessageReaction,
      user: User
    ) =>
      ['✅', '❌'].includes(reaction.emoji.name) &&
      message.author.id === user.id;

    embed
      .setColor(colors.blue)
      .setTitle(':one: Request - Choose a character')
      .setDescription('Choose a character by typing the number before it')
      .setFooter('');

    let column: string[] = [];

    heroes.forEach(({ name, emoji }, idx) => {
      column.push(`**${idx + 1}**. <${emoji}> ${name}`);
      if (idx > 0 && idx % 15 === 0) {
        embed.addField('\u200B', column.join('\n'), true);
        column = [];
      }
    });
    const prompt = await message.channel.send(embed);
    message.channel.stopTyping();

    const heroeSelection = await message.channel.awaitMessages(
      heroSelectionFilter,
      {
        max: 1,
        time: 30000,
        errors: ['time'],
      }
    );
    await heroeSelection.first()?.delete();

    const selection =
      heroes[parseInt(heroeSelection.first()?.content as string, 10) - 1];

    embed
      .setTitle(':two: Request - Choose a lender')
      .setDescription(
        `Please tag the person you want to request <${selection.emoji}> ${selection.name} from`
      )
      .spliceFields(0, 3);

    await prompt.edit(embed);

    const lenderSelection = await message.channel.awaitMessages(
      lenderSelectorFilter,
      {
        max: 1,
        time: 30000,
        errors: ['time'],
      }
    );
    lenderSelection.first()?.delete();

    const lender = lenderSelection.first()?.mentions.users.map((u) => u.id)[0];

    embed
      .setTitle(':three: Request - Confirmation')
      .setDescription(
        `So you want to request <${selection.emoji}> ${selection.name} from <@${lender}>?`
      )
      .setFooter('React with ✅ to confirm or ❌ to start over');

    await prompt.edit(embed);

    prompt.react('✅');
    prompt.react('❌');

    const confirmation = await prompt.awaitReactions(confirmationFilter, {
      max: 1,
      time: 60000,
      errors: ['time'],
    });

    await prompt.reactions.removeAll();
    const answer = confirmation.first();

    if (answer?.emoji.name === '❌') {
      prompt.delete();
      handleDataGathering(embed, message, server);
      return;
    }
    if (answer?.emoji.name === '✅') {
      embed
        .setColor(colors.green)
        .setTitle(':white_check_mark: Request - Success!')
        .setDescription(
          `Your request has been made and published to <#${server.requestChannel}>`
        )
        .setFooter('');

      const requestEmbed = new Discord.MessageEmbed()
        .setColor(colors.blue)
        .setTitle('Character Request')
        .setDescription(
          `Hey <@${lender}>, <@${message.author.id}> would like to borrow your <${selection.emoji}> ${selection.name}.`
        )
        .setFooter(
          `<@${lender}>, Please react with ✅ to confirm or ❌ to decline`
        );

      const requestChannel = message.client.channels.cache.get(
        server.requestChannel
      ) as TextChannel;

      const req = await requestChannel.send(requestEmbed);
      req.react('✅');
      req.react('❌');
      await prompt.edit(embed);
    }
  } catch (err) {
    console.error(err);
  }
};

const request: CommandPromise = async (server, message) => {
  try {
    const embed = new Discord.MessageEmbed();
    await handleDataGathering(embed, message, server);
  } catch (err) {
    console.error(err);
  }
};

export default request;
