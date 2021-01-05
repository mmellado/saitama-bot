import { Collection, GuildMember, Role } from 'discord.js';
import isAdminUser from './isAdminUser';
import { Settings as ServerSettings } from '../models/server';

const isModUser = (settings: ServerSettings, member: GuildMember): boolean => {
  const userRoles = member.roles.cache as Collection<string, Role>;
  return (
    isAdminUser(member) ||
    userRoles.some((role: Role) => {
      if (settings.modRoles.includes(role.id)) {
        return true;
      }

      return false;
    })
  );
};

export default isModUser;
