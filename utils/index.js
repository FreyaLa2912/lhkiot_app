import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { numericFormatter } from 'react-number-format';

const GetLocalStorage = async (name) => {
  return await AsyncStorage.getItem(name);
};

const SetLocalStorage = async (name, value) => {
  // AsyncStorage.setItem(name, JSON.stringify(value));
  await AsyncStorage.setItem(name, value);
};

const RemoveLocalStorage = async (name) => {
  await AsyncStorage.removeItem(name);
};

const calDateAgo = (d) => {
  let date = moment(d);

  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  return Math.floor(seconds) + ' seconds ago';
};

const toCamel = (o) => {
  let newO, origKey, newKey, value;
  if (o instanceof Array) {
    return o.map(function (value) {
      if (typeof value === 'object') {
        value = toCamel(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
        value = o[origKey];
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toCamel(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
};

const dateToTicks = (date) => {
  const epochOffset = 621355968000000000;
  const ticksPerMillisecond = 10000;

  const ticks = epochOffset + date.getTime() * ticksPerMillisecond;

  return Math.floor(ticks / 10000);
};

const addDays = (date, days) => {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const minusDays = (date, days) => {
  let result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const getCurrentWeek = () => {
  const todaydate = new Date();
  const oneJan = new Date(todaydate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));
  const curWeek = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);
  return curWeek;
};

const isNumber = (input) => {
  if (!input) return false;
  return isFinite(input);
};

const delayDuration = (delay) => {
  return new Promise((res) => setTimeout(res, delay));
};

const numbericFormat = (value) => {
  if (!value) return 0;
  return numericFormatter(value.toString(), {
    thousandSeparator: ',',
    decimalSeparator: '.',
    displayType: 'text',
  });
};

export {
  //local storage
  GetLocalStorage,
  SetLocalStorage,
  RemoveLocalStorage,

  //utils
  calDateAgo,
  toCamel,
  dateToTicks,
  addDays,
  minusDays,
  getCurrentWeek,
  isNumber,
  delayDuration,
  numbericFormat,
};
