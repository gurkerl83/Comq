import Link from 'next/link';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SITE_NAME } from '../../lib/site/config';
import {
  createJsonLdMarkup,
  createSiteStructuredData
} from '../../lib/site/json-ld';
import { CompanyLogoStrip } from '../experience/CompanyLogoStrip';
import { ArrowRightIcon } from '../site/icons';
import { QuoteInvitation } from '../site/QuoteInvitation';
import styles from './HomePage.module.css';
import { ServiceImagePlaceholder } from './ServiceImagePlaceholder';

export function HomePage({
  locale,
  dictionary
}: {
  locale: SupportedLocale;
  dictionary: Dictionary;
}) {
  const services = [
    {
      id: 'venta',
      title: dictionary.services.salesTitle,
      description: dictionary.services.salesDescription
    },
    {
      id: 'alquiler',
      title: dictionary.services.rentalsTitle,
      description: dictionary.services.rentalsDescription
    },
    {
      id: 'repuestos',
      title: dictionary.services.partsTitle,
      description: dictionary.services.partsDescription
    }
  ];

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={createJsonLdMarkup(
          createSiteStructuredData(locale, dictionary)
        )}
      />
      <section className={styles.hero} aria-labelledby='company-name'>
        <div className={styles.content}>
          <h1 id='company-name'>{SITE_NAME}</h1>
          <p className={styles.slogan}>{dictionary.home.slogan}</p>
          <p className={styles.description}>{dictionary.home.description}</p>
        </div>
      </section>
      <CompanyLogoStrip catchphrase={dictionary.experience.catchphrase} />
      {services.map(service => (
        <section
          key={service.id}
          id={service.id}
          className={styles.serviceSection}
          aria-labelledby={`${service.id}-heading`}
        >
          <h2 id={`${service.id}-heading`}>
            <Link
              className={styles.serviceTitleLink}
              href={createHrefForLocale(locale, `/${service.id}`)}
            >
              <span>{service.title}</span>
              <ArrowRightIcon />
            </Link>
          </h2>
          <Link
            className={styles.serviceImageLink}
            href={createHrefForLocale(locale, `/${service.id}`)}
            aria-labelledby={`${service.id}-heading`}
          >
            <ServiceImagePlaceholder
              className={styles.serviceImage}
              alt={`${dictionary.services.imagePlaceholder}: ${service.title}`}
            />
          </Link>
          <p>{service.description}</p>
        </section>
      ))}
      <QuoteInvitation dictionary={dictionary} />
    </>
  );
}
