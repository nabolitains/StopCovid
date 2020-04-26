import AsyncStorage from '@react-native-community/async-storage';

export {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from './scale';
export { secondsToTime, secondsToTimeString } from './time';

export const composeFn = (...fns: any[]) => (...args: any) => fns.map(fn => fn(...args));

export const storage = {
  async get(key: string, defaultValue:any = null) {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  async save(key:string, json: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(json));
    } catch (error) {
      // Ignore Error
    }
  },
  async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Ignore Error
    }
  },
};
