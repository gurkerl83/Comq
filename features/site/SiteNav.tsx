import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SITE_NAME } from '../../lib/site/config';
import { BrandSymbol } from './BrandSymbol';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Link } from '../../components/Link';
import { ThemeToggle } from './ThemeToggle';
import styles from './SiteShell.module.css';

type SiteNavProps = {
  /** The page's language, for the home link and the language links. */
  locale: SupportedLocale;
  /** The site's texts in the page's language. */
  dictionary: Dictionary;
};

/** Show the sticky site header: the brand link, then the page preferences. */
export function SiteNav({ locale, dictionary }: SiteNavProps) {
  return (
    <header className={styles.header}>
      <Link
        className={styles.brandLink}
        href={createHrefForLocale(locale, '/')}
        aria-label={`${SITE_NAME} — ${dictionary.navigation.home}`}
      >
        <BrandSymbol className={styles.brandIcon} />
      </Link>
      <div className={styles.preferences}>
        <LanguageSwitcher
          locale={locale}
          label={dictionary.navigation.language}
        />
        <ThemeToggle labels={dictionary.theme} />
      </div>
    </header>
  );
}
