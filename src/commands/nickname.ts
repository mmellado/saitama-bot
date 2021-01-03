import { CommandPromise } from './types';

const nickname: CommandPromise = async (_, message, args) => {
  const newNickname = (args && args.join(' ')) || '';
  await message.member?.setNickname(newNickname);

  if (!newNickname) {
    message.channel.send('Your nickname has been reset');
  } else {
    message.channel.send(`Your nickname has been updated to ${newNickname}`);
  }
};

export default nickname;
