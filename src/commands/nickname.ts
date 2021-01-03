import Discord from 'discord.js';
import { CommandPromise } from './types';

const nickname: CommandPromise = async (_, message, args) => {
  try {
    const newNickname = (args && args.join(' ')) || '';
    await message.member?.setNickname(newNickname);

    message.delete();
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(':pencil: Nickname updated!')
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
