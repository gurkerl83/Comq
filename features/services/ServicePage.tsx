import type { Dictionary, ServiceKey } from '../../lib/i18n/types';
import { QuoteLink } from '../site/QuoteLink';
import styles from './ServicePage.module.css';

export function ServicePage({
  dictionary,
  service
}: {
  dictionary: Dictionary;
  service: ServiceKey;
}) {
  const { quoteHeading, pages } = dictionary.servicePages;
  const content = pages[service];
  const detailSections = [
    { id: 'options', ...content.options },
    { id: 'details', ...content.details }
  ];

  return (
    <article aria-labelledby='service-title'>
      <section className={styles.offer} aria-labelledby='service-title'>
        <h1 id='service-title' className={styles.title}>
          {content.title}
        </h1>
        <p className={styles.introduction}>{content.introduction}</p>
      </section>

      <div className={styles.details}>
        {detailSections.map(section => (
          <section
            key={section.id}
            className={styles.detailSection}
            aria-labelledby={`service-${section.id}`}
          >
            <h2 id={`service-${section.id}`}>{section.heading}</h2>
            <ul>
              {section.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className={styles.closing} aria-labelledby='service-quote'>
        <h2 id='service-quote'>{quoteHeading}</h2>
        <ul className={styles.requirements}>
          {content.quoteRequirements.map(requirement => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
        <QuoteLink
          label={dictionary.navigation.whatsapp}
          accessibleLabel={dictionary.navigation.whatsappLabel}
        />
      </section>
    </article>
  );
}
