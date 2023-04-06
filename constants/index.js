import argonTheme from './Theme';
import articles from './articles';
import Images from './Images';
import tabs from './tabs';

const LOGIN_URL = '/login/check-login';
const REFRESH_TOKEN_URL = '/refreshtoken';

const COMPANY = '_SoluM';
const CURRENT_LANGUAGE = `current_language_${COMPANY}`;
const USER_INFO = `CURRENT_USER${COMPANY}`;

export {
  articles,
  argonTheme,
  Images,
  tabs,

  //string constant
  LOGIN_URL,
  REFRESH_TOKEN_URL,
  CURRENT_LANGUAGE,
  USER_INFO,
};
