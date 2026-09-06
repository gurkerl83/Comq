import styles from './ServicePage.module.css';

export function ServicePage({ title }: { title: string }) {
  return (
    <section className={styles.section} aria-labelledby='service-title'>
      <h1 id='service-title'>{title}</h1>
    </section>
  );
}
