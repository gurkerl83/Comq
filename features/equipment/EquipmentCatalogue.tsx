'use client';

import { useState } from 'react';

import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { getCatalogueContent } from './catalogue-content';
import { getMachineContent } from './machine-content';
import type { MachineTab } from './machine-tabs';
import { getEquipmentNavigationContent } from './navigation-content';
import { MachineBrowseCard } from './MachineBrowseCard';
import { MachineComqVersion } from './MachineComqVersion';
import { MachineEquipment } from './MachineEquipment';
import { MachineMedia } from './MachineMedia';
import { MachineOverview } from './MachineOverview';
import { MachineRangeViews } from './MachineRangeViews';
import { Specifications } from './selector/components/Specifications';
import type { EquipmentCategoryId, EquipmentEntry } from './types';
import { useBrowseSelection } from './useBrowseSelection';
import styles from './EquipmentCatalogue.module.css';

type EquipmentCatalogueProps = {
  /** The page's language, for the catalogue texts and machine links. */
  locale: SupportedLocale;
  /** The machines to list; without any, the section is left out. */
  machines: EquipmentEntry[];
};

/** The list's filter: every machine, or the machines of one category. */
type CategoryFilter = EquipmentCategoryId | 'all';

/**
 * The sales-page catalogue: a list of the machines and a preview of the
 * chosen one.
 *
 * 1. From 900px the list takes a third of the width and the preview two
 *    thirds; below, the list becomes a sideways strip above the preview.
 * 2. The filter above the list narrows it to one category. Choosing a
 *    category shows its first machine unless the chosen one belongs to it.
 * 3. The chosen machine and tab are in the address, so a link opens the
 *    same preview and Back returns to the previous one (useBrowseSelection).
 * 4. The preview reuses the machine page's parts: MachineMedia,
 *    MachineOverview and one content section per tab.
 */
export function EquipmentCatalogue({
  locale,
  machines
}: EquipmentCatalogueProps) {
  const translations = getCatalogueContent(locale);
  const content = getMachineContent(locale);
  const navigation = getEquipmentNavigationContent(locale);
  const { machine, tab, tabs, selectMachine, selectTab } =
    useBrowseSelection(machines);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  if (!machine) return null;

  // The categories in catalogue order, each with its machines.
  const groups = [
    ...new Map(machines.map(entry => [entry.category, entry.categoryName]))
  ].map(([id, name]) => ({
    id,
    name,
    machines: machines.filter(entry => entry.category === id)
  }));
  const shownGroups = groups.filter(
    group => filter === 'all' || group.id === filter
  );
  const tabLabels: Record<MachineTab, string> = {
    specifications: content.specifications,
    range: content.rangeViews,
    comq: content.comqVersion,
    options: content.options
  };

  /**
   * Narrow the list to a category, or show every machine again. When the
   * chosen machine is not in the category, its first machine shows.
   *
   * @param next - The category, or 'all'.
   */
  function chooseFilter(next: CategoryFilter) {
    setFilter(next);
    if (next === 'all' || machine?.category === next) return;
    const [first] = machines.filter(entry => entry.category === next);
    if (first) selectMachine(first.slug);
  }

  return (
    <section
      id='equipment-catalogue'
      className={styles.catalogue}
      aria-labelledby='equipment-catalogue-title'
    >
      <h2 id='equipment-catalogue-title'>{translations.title}</h2>
      <p className={styles.introduction}>{translations.introduction}</p>

      <div className={styles.browser}>
        <div className={styles.listPane}>
          <div className={`${styles.bar} ${styles.filters}`}>
            <Button
              variant='tab'
              type='button'
              className={styles.tab}
              data-current={filter === 'all'}
              onClick={() => chooseFilter('all')}
            >
              {translations.all}
              <span className={styles.count}>{machines.length}</span>
            </Button>
            {groups.map(group => (
              <Button
                key={group.id}
                variant='tab'
                type='button'
                className={styles.tab}
                data-current={filter === group.id}
                onClick={() => chooseFilter(group.id)}
              >
                {group.name}
                <span className={styles.count}>{group.machines.length}</span>
              </Button>
            ))}
          </div>

          <ul className={styles.list}>
            {shownGroups.map(group => [
              <li key={group.id} className={styles.groupLabel}>
                {group.name}
              </li>,
              ...group.machines.map(entry => (
                <li key={entry.slug} className={styles.item}>
                  <MachineBrowseCard
                    machine={entry}
                    selected={entry.slug === machine.slug}
                    onSelect={() => selectMachine(entry.slug)}
                    translations={translations}
                  />
                </li>
              ))
            ])}
          </ul>

          <p className={styles.hint}>
            {translations.selectorHint}{' '}
            <Link href={createHrefForLocale(locale, '/selector')}>
              {navigation.selector}
            </Link>
          </p>
        </div>

        <article className={styles.preview} aria-labelledby='equipment-title'>
          <div className={styles.previewTop}>
            <MachineMedia equipment={machine} content={content} />
            <MachineOverview equipment={machine} content={content} heading='h2'>
              <Specifications
                items={machine.specifications.slice(0, 3)}
                fallback={content.unconfirmed}
              />
              <div className={styles.actions}>
                <Button
                  variant='primary'
                  className={styles.enquiry}
                  href={{
                    pathname: createHrefForLocale(locale, '/selector'),
                    query: { machine: machine.slug }
                  }}
                >
                  {content.select}
                </Button>
                <Button
                  variant='secondary'
                  className={styles.machinePage}
                  href={createHrefForLocale(locale, `/equipos/${machine.slug}`)}
                >
                  {translations.details}
                </Button>
              </div>
            </MachineOverview>
          </div>

          <div className={`${styles.bar} ${styles.tabs}`}>
            {tabs.map(id => (
              <Button
                key={id}
                variant='tab'
                type='button'
                className={styles.tab}
                data-current={id === tab}
                onClick={() => selectTab(id)}
              >
                {tabLabels[id]}
              </Button>
            ))}
          </div>

          <div className={styles.panel}>
            {tab === 'specifications' && (
              <div className={styles.specifications}>
                <p>{machine.application}</p>
                <Specifications
                  items={machine.specifications}
                  fallback={content.unconfirmed}
                />
              </div>
            )}
            {tab === 'range' && (
              <MachineRangeViews equipment={machine} content={content} />
            )}
            {tab === 'comq' && (
              <MachineComqVersion equipment={machine} content={content} />
            )}
            {tab === 'options' && (
              <MachineEquipment equipment={machine} content={content} />
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
