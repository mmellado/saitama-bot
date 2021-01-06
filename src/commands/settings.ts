import Discord from 'discord.js';
import { Command } from './types';
import colors from '../utils/colors';

const settings: Command = (server, message) => {
  const embed = new Discord.MessageEmbed()
    .setColor(colors.blue)
    .setTitle('Server settings')
    .setDescription(`To update thesesettings, use \`${server.prefix}setup\`.`)
    .addFields(
      {
        name: 'Mod roles',
        value: server.modRoles.length
          ? server.modRoles.map((r) => `<@&${r}>`).join(', ')
          : 'Not configured',
      },
      {
        name: 'Prefix',
        value: `\`${server.prefix}\``,
      },
      {
        name: 'Announcements channel',
        value: server.announceChannel
          ? `<#${server.announceChannel}>`
          : 'Not configured',
      },
      {
        name: 'Codes channel',
        value: server.codeChannel
          ? `<#${server.codeChannel}>`
          : 'Not configured',
      },
      {
        name: 'Requests channel',
        value: server.requestChannel
          ? `<#${server.requestChannel}>`
          : 'Not configured',
      }
    );

  message.channel.send(embed);
};

export default settings;
