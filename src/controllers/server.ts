import dotenv from 'dotenv';
import { Message } from 'discord.js';
import Client from '@replit/database';
import { Settings as ServerSettings } from '../models/server';
import { SetterResponse } from './types';

dotenv.config();

const db = new Client(process.env.REPLIT_DB_URL);

const getKey = (serverId: string): string => `server-${serverId}`;

const defaultSettings = {
  modRoles: [],
  prefix: 's!',
  announceChannel: '',
  codeChannel: '',
  requestChannel: '',
};

export const setServerSettings = async (
  serverId: string,
  settings: ServerSettings
): Promise<SetterResponse> => {
  try {
    const key = getKey(serverId);
    await db.set(key, JSON.stringify(settings));
    return { code: 200, message: 'success' };
  } catch (error) {
    return { code: 500, message: error };
  }
};

export const getServerSettings = async (
  serverId: string
): Promise<ServerSettings> => {
  try {
    const key = getKey(serverId);
    const data = await db.get(key);
    return JSON.parse(data as string) as ServerSettings;
  } catch (error) {
    return { ...defaultSettings, error: 'No server with provided ID' };
  }
};

export const getServerSettingsFromMessage = async (
  message: Message
): Promise<ServerSettings> => {
  try {
    const serverId = message.guild?.id as string;
    const key = getKey(serverId);
    const data = await db.get(key);
    if (data) {
      return JSON.parse(data as string) as ServerSettings;
    }

    const defaultChannelId = message.client.channels.cache.find(
      (channel) => channel.type === 'text'
    )?.id as string;
    const settings = {
      ...defaultSettings,
      announceChannel: defaultChannelId,
      codeChannel: defaultChannelId,
      requestChannel: defaultChannelId,
    };
    await setServerSettings(serverId, settings);
    return settings;
  } catch {
    return { ...defaultSettings, error: 'No server with provided ID' };
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
