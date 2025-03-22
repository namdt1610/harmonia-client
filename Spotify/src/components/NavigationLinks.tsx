'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NavigationLinksProps {
      locale: string;
}

export default function NavigationLinks({ locale }: NavigationLinksProps) {
      const pathname = usePathname();
      const t = useTranslations('Navigation');

      return (
            <nav className="mb-6 px-2">
                  <ul className="space-y-2">
                        <li>
                              <Link
                                    href={`/${locale}`}
                                    className={`flex items-center p-3 rounded-md transition-colors ${pathname === `/${locale}` ? 'bg-neutral-800' : 'hover:bg-neutral-800'
                                          }`}
                              >
                                    <Home size={24} className="mr-4" />
                                    <span className="font-medium">{t('home', { fallback: 'Home' })}</span>
                              </Link>
                        </li>
                        <li>
                              <Link
                                    href={`/${locale}/search`}
                                    className={`flex items-center p-3 rounded-md transition-colors ${pathname.includes('/search') ? 'bg-neutral-800' : 'hover:bg-neutral-800'
                                          }`}
                              >
                                    <Search size={24} className="mr-4" />
                                    <span className="font-medium">{t('search', { fallback: 'Search' })}</span>
                              </Link>
                        </li>
                        <li>
                              <Link
                                    href={`/${locale}/library`}
                                    className={`flex items-center p-3 rounded-md transition-colors ${pathname.includes('/library') ? 'bg-neutral-800' : 'hover:bg-neutral-800'
                                          }`}
                              >
                                    <Library size={24} className="mr-4" />
                                    <span className="font-medium">{t('library', { fallback: 'Your Library' })}</span>
                              </Link>
                        </li>
                  </ul>
            </nav>
      );
}