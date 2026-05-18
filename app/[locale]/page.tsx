'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('common');
  const locale = useLocale();
  const otherLocale = locale === 'en' ? 'ur' : 'en';

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold mb-4">
          {t('welcome')}
        </h1>
        
        <div className="flex gap-4">
          <Link
            href={`/${otherLocale}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {otherLocale === 'en' ? '🇬🇧 English' : '🇵🇰 اردو'}
          </Link>
        </div>

        <div className="mt-8 text-center">
          <nav className="flex gap-6 flex-wrap justify-center">
            <Link href="#" className="hover:underline">{t('home')}</Link>
            <Link href="#" className="hover:underline">{t('about')}</Link>
            <Link href="#" className="hover:underline">{t('services')}</Link>
            <Link href="#" className="hover:underline">{t('contact')}</Link>
          </nav>
        </div>
      </main>
    </div>
  );
}
