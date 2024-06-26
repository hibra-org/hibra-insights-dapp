const LOCALES_COOKIE_CONFIG = {
  maxAge: 60 * 60 * 24,
  httpOnly: false,
  secure: process.env.NEXT_PUBLIC_MODE_ENV !== 'development',
  sameSite: 'lax' as 'lax',
};

const LOCALES_CONFIG = {
  defaultLocale: 'en' as TDefaultLocale,
};

export { LOCALES_COOKIE_CONFIG, LOCALES_CONFIG };
