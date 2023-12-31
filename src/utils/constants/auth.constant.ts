const ACCESS_TOKEN_COOKIE_CONFIG = {
  maxAge: 60 * 5,
  httpOnly: false,
  secure: process.env.NEXT_PUBLIC_MODE_ENV !== 'development',
  sameSite: 'lax' as 'lax',
};

const REFRESH_TOKEN_COOKIE_CONFIG = {
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: false,
  secure: process.env.NEXT_PUBLIC_MODE_ENV !== 'development',
  sameSite: 'lax' as 'lax',
};

const SALT = 10;

// eslint-disable-next-line no-unused-vars
enum COOKIE_KEYS {
  // eslint-disable-next-line no-unused-vars
  AUTH = 'auth',
}

export {
  ACCESS_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_COOKIE_CONFIG,
  SALT,
  COOKIE_KEYS,
};
