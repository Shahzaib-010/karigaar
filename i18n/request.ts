import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import enMessages from '../messages/en.json';
import urMessages from '../messages/ur.json';

type Locale = (typeof routing.locales)[number];
type Messages = typeof enMessages;

function isLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

const messagesByLocale: Record<Locale, Messages> = {
  en: enMessages,
  ur: urMessages
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const validLocale: Locale =
    requestedLocale && isLocale(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

  return {
    locale: validLocale,
    messages: messagesByLocale[validLocale]
  };
});
