import { CommandPromise } from './types';

const nickname: CommandPromise = async (_, message, args) => {
  try {
    const newNickname = (args && args.join(' ')) || '';
    await message.member?.setNickname(newNickname);

    message.delete();
    message.channel.send(
      `Your nickname has been updated, ${message.author.toString()}`
    );
  } catch (err) {
    console.error(err);
  }
};

export default nickname;
