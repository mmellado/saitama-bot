import dotenv from 'dotenv';
import { Collection, Role } from 'discord.js';

dotenv.config();

const adminRoles =
  process.env.ADMIN_ROLES?.split(',').map((r) => r.trim()) || [];

const isAdminUser = (userRoles: Collection<string, Role>): boolean =>
  userRoles.some((role: Role) => {
    if (adminRoles.includes(role.name)) {
      console.log(`Incluye ele rol ${role.name}`);
      return true;
    }

    return false;
  });

export default isAdminUser;
