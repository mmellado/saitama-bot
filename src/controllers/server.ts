import Client from '@replit/database';
import { Settings as ServerSettings } from '../models/server';
import { SetterResponse } from './types';

const db = new Client();

const getKey = (serverId: string): string => `server-${serverId}`;

export const getServerSettings = async (
  serverId: string
): Promise<ServerSettings> => {
  try {
    const key = getKey(serverId);
    const data = await db.get(key);
    return JSON.parse(data as string) as ServerSettings;
  } catch {
    return { error: 'No server with provided ID' };
  }
};

export const setPrefix = async (
  serverId: string,
  newPrefix: string
): Promise<SetterResponse> => {
  try {
    const key = getKey(serverId);
    const settings = await getServerSettings(serverId);
    const updatedSettings: ServerSettings = { ...settings, prefix: newPrefix };
    await db.set(key, JSON.stringify(updatedSettings));
    return { code: 200, message: 'success' };
  } catch (error) {
    return { code: 500, message: error };
  }
};

export const setAnnounceChannel = async (
  serverId: string,
  newChannel: string
): Promise<SetterResponse> => {
  try {
    const key = getKey(serverId);
    const settings = await getServerSettings(serverId);
    const updatedSettings: ServerSettings = {
      ...settings,
      announceChannel: newChannel,
    };
    await db.set(key, JSON.stringify(updatedSettings));
    return { code: 200, message: 'success' };
  } catch (error) {
    return { code: 500, message: error };
  }
};

export const setCodeChannel = async (
  serverId: string,
  newChannel: string
): Promise<SetterResponse> => {
  try {
    const key = getKey(serverId);
    const settings = await getServerSettings(serverId);
    const updatedSettings: ServerSettings = {
      ...settings,
      codeChannel: newChannel,
    };
    await db.set(key, JSON.stringify(updatedSettings));
    return { code: 200, message: 'success' };
  } catch (error) {
    return { code: 500, message: error };
  }
};

export const setRequestChannel = async (
  serverId: string,
  newChannel: string
): Promise<SetterResponse> => {
  try {
    const key = getKey(serverId);
    const settings = await getServerSettings(serverId);
    const updatedSettings: ServerSettings = {
      ...settings,
      requestChannel: newChannel,
    };
    await db.set(key, JSON.stringify(updatedSettings));
    return { code: 200, message: 'success' };
  } catch (error) {
    return { code: 500, message: error };
  }
};

export const deleteModRole = async (
  serverId: string,
  roleId: string
): Promise<SetterResponse> => {
  try {
    const key = getKey(serverId);
    const settings = await getServerSettings(serverId);
    const { modRoles } = settings;
    const newModRoles = modRoles?.filter((rId) => rId !== roleId);
    const updatedSettings: ServerSettings = {
      ...settings,
      modRoles: newModRoles,
    };
    await db.set(key, JSON.stringify(updatedSettings));
    return { code: 200, message: 'success' };
  } catch (error) {
    return { code: 500, message: error };
  }
};

export const addModRoles = async (
  serverId: string,
  newRoles: string[]
): Promise<SetterResponse> => {
  try {
    const key = getKey(serverId);
    const settings = await getServerSettings(serverId);
    const roles = settings.modRoles || [];
    const newModRoles = [...new Set([...roles, ...newRoles])];
    const updatedSettings: ServerSettings = {
      ...settings,
      modRoles: newModRoles,
    };
    await db.set(key, JSON.stringify(updatedSettings));
    return { code: 200, message: 'success' };
  } catch (error) {
    return { code: 500, message: error };
  }
};
