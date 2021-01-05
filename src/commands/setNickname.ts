import Discord, { GuildMember } from 'discord.js';
import { CommandPromise } from './types';
import isModUser from '../utils/isModUser';
import colors from '../utils/colors';

const nickname: CommandPromise = async (server, message, args) => {
  try {
    if (!isModUser(server, message.member as GuildMember)) {
      return;
    }

    const fullCommand = (args && args.join(' ').trim()) || '';
    const userData = fullCommand.match(/^<@!?(\d+)>/);

    await message.delete();

    const embed = new Discord.MessageEmbed()
      .setColor(colors.red)
      .setTitle(':no_entry: Set Nickname - Error!')
      .setDescription(`Please tag the user whose nickname is to be updated`);

    if (!userData) {
      message.channel.send(embed);
      return;
    }

    const member = message.guild?.members.cache.get(userData[1]);
    const newNickname = fullCommand.replace(userData[0], '').trim();

    await member?.setNickname(newNickname);

    embed
      .setColor(colors.green)
      .setTitle(':white_check_mark: Set Nickname - Success!')
      .setDescription(
        `The nickname for ${member?.toString()} has been updated.`
      )
      .setTimestamp();

    message.channel.send(embed);
  } catch (err) {
    console.error(err);
  }
};

export default nickname;
