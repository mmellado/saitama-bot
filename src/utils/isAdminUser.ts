import dotenv from 'dotenv';
import { Role } from 'discord.js';

dotenv.config();

const adminRoles =
  process.env.ADMIN_ROLES?.split(',').map((r) => r.trim()) || [];

const isAdminUser = (userRoles: Role[]) =>
  userRoles.some((role) => {
    if (adminRoles.includes(role.name)) {
      return true;
    }

    return false;
  });

export default isAdminUser;
