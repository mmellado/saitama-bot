import Discord, { GuildMember } from 'discord.js';
import { Command } from './types';
import isAdminUser from '../utils/isAdminUser';
import colors from '../utils/colors';

const settings: Command = (server, message) => {
  if (!isAdminUser(message.member as GuildMember)) {
    return;
  }
  const embed = new Discord.MessageEmbed()
    .setColor(colors.blue)
    .setTitle('Server settings')
    .setDescription(`To update thesesettings, use \`${server.prefix}setup\`.`)
    .addFields(
      {
        name: 'Mod roles',
        value: server.modRoles.map((r) => `<@&${r}>`).join(', '),
      },
      {
        name: 'Prefix',
        value: `\`${server.prefix}\``,
      },
      {
        name: 'Announcements channel',
        value: `<#${server.announceChannel}>`,
      },
      {
        name: 'Codes channel',
        value: `<#${server.codeChannel}>`,
      },
      {
        name: 'Requests channel',
        value: `<#${server.requestChannel}>`,
      }
    );

  message.channel.send(embed);
};

export default settings;
