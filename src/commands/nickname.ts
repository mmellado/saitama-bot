import Discord from 'discord.js';
import { CommandPromise } from './types';
import colors from '../utils/colors';

const nickname: CommandPromise = async (_server, message, args) => {
  try {
    const newNickname = (args && args.join(' ')) || '';
    await message.member?.setNickname(newNickname);

    message.delete();
    const embed = new Discord.MessageEmbed()
      .setColor(colors.green)
      .setTitle(':white_check_mark: Nickname updated!')
      .setDescription(
        `Your nickname has been updated, ${message.author.toString()}`
      )
      .setTimestamp();

    message.channel.send(embed);
  } catch (err) {
    console.error(err);
  }
};

export default nickname;
