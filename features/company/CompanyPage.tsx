import type { Dictionary } from '../../lib/i18n/types';
import { QuoteInvitation } from '../site/QuoteInvitation';
import styles from './CompanyPage.module.css';

type CompanyPageProps = {
  /** The site's texts in the page's language. */
  dictionary: Dictionary;
};

export function CompanyPage({ dictionary }: CompanyPageProps) {
  const { company } = dictionary;
  const sections = [company.purpose, company.customers, company.approach];

  return (
    <>
      <article
        id='about'
        className={styles.page}
        aria-labelledby='company-heading'
      >
        <header className={styles.introduction}>
          <h1 id='company-heading'>{company.heading}</h1>
          <p>{company.description}</p>
        </header>
        {sections.map(section => (
          <section key={section.heading} className={styles.section}>
            <h2>{section.heading}</h2>
            <p>{section.description}</p>
          </section>
        ))}
      </article>
      <QuoteInvitation dictionary={dictionary} />
    </>
  );
}
