import { NativeModules } from 'react-native';

const { DeviceDetails } = NativeModules;

interface DeviceInfo {
  brand: string;
  model: string;
  osVersion: string;
  systemName: string;
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  try {
    if (!DeviceDetails) {
        // Fallback for development if module is not linked
        return {
            brand: 'Mock Brand',
            model: 'Mock Model',
            osVersion: 'Mock OS',
            systemName: 'Mock System',
        };
    }
    return await DeviceDetails.getDeviceInfo();
  } catch (error) {
    console.error('Failed to get device info:', error);
    throw error;
  }
};
