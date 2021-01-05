import { GuildMember } from 'discord.js';

const isAdminUser = (member: GuildMember): boolean =>
  member?.hasPermission('ADMINISTRATOR');

export default isAdminUser;
