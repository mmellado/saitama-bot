import Discord, { Message } from 'discord.js';
import { Settings as ServerSettings } from '../models/server';
import { Command, CommandData } from './types';
import colors from '../utils/colors';
import commands from './index';

const renderCommands = (
  permissions: 0 | 1 | 2 | 3,
  server: ServerSettings,
  message: Message
) => {
  const cmds = commands.filter(
    (commandData: CommandData) => commandData.permissions === permissions
  );

  const { prefix } = server;
  const titles = ['Admin commands', 'Mod commands', 'Commands', 'Help'];

  const embed = new Discord.MessageEmbed()
    .setColor(colors.blue)
    .setThumbnail('https://i.imgur.com/e9DIB8e.png')
    .setTitle(titles[permissions]);

  if (permissions === 3) {
    embed.addFields(
      {
        name: 'Commands',
        value: `\`${prefix}help commands\``,
        inline: true,
      },
      {
        name: 'Moderator',
        value: `\`${prefix}help moderator\``,
        inline: true,
      },
      {
        name: 'Admin',
        value: `\`${prefix}help admin\``,
        inline: true,
      }
    );
  }

  cmds.keyArray().forEach((cmd) => {
    const cmdArr = [`${prefix}${cmd}`];
    const cmdData = cmds.get(cmd);

    if (cmdData?.arguments) {
      cmdArr.push(cmdData.arguments);
    }
    embed.addField(`\`${cmdArr.join(' ')}\``, cmdData?.description);
  });

  message.channel.send(embed);
};

const help: Command = (server, message, args) => {
  const argument = args ? args[0] : null;

  console.log();

  if (argument === 'admin') {
    renderCommands(0, server, message);
  } else if (argument === 'moderator') {
    renderCommands(1, server, message);
  } else if (argument === 'commands') {
    renderCommands(2, server, message);
  } else {
    renderCommands(3, server, message);
  }
};

export default help;
