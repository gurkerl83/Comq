import type { CSSProperties } from 'react';
import Image from 'next/image';

import type { NetworkContent, NetworkRoleId } from '../../lib/i18n/types';
import styles from './MiningNetwork.module.css';
import { NetworkConnections } from './NetworkConnections';

/**
 * - labels: each scene has its role label above it.
 * - roleList: each panel header lists its roles; the scenes are unlabeled.
 */
export type MiningNetworkVariant = 'labels' | 'roleList';

/** A scene file's pixel size. */
type Size = { width: number; height: number };
type Side = {
  id: 'companies' | 'suppliers';
  roles: [NetworkRoleId, NetworkRoleId, NetworkRoleId];
};

/** Roles on each side, top to bottom. */
const companies: Side = {
  id: 'companies',
  roles: ['operations', 'maintenance', 'procurement']
};
const suppliers: Side = {
  id: 'suppliers',
  roles: ['sales', 'engineering', 'service']
};

/**
 * Scene artwork in `public/images/company/network/`, one file per role named
 * after it and shared by both variants. Sizes are the files' pixel dimensions.
 */
const sceneFolder = '/images/company/network';
const scenes: Record<NetworkRoleId, Size> = {
  operations: { width: 359, height: 154 },
  maintenance: { width: 389, height: 166 },
  procurement: { width: 362, height: 156 },
  sales: { width: 386, height: 153 },
  engineering: { width: 348, height: 165 },
  service: { width: 363, height: 160 }
};

/** Both variants show the same smiling COMQ team in the hub. */
const team = {
  src: '/images/company/network/comq-team.png',
  width: 346,
  height: 195
};

function NetworkSide({
  side,
  content,
  variant
}: {
  side: Side;
  content: NetworkContent;
  variant: MiningNetworkVariant;
}) {
  const text = content[side.id];
  const roleList = variant === 'roleList';
  return (
    <div className={`${styles.side} ${styles[side.id]}`}>
      <div className={styles.sideHeader}>
        <h3 className={styles.sideHeading}>{text.heading}</h3>
        <p className={styles.sideDescription}>{text.description}</p>
        {/* Screen readers hear each role in the list below instead. */}
        {roleList && (
          <p className={styles.roleSummary} aria-hidden='true'>
            {side.roles.map(role => content.roles[role]).join(' · ')}
          </p>
        )}
      </div>
      <ul className={styles.roles} role='list'>
        {side.roles.map(role => (
          <li key={role} className={styles.role}>
            <span className={roleList ? styles.hiddenLabel : styles.roleLabel}>
              {content.roles[role]}
            </span>
            <Image
              className={styles.scene}
              style={{ '--scene-width': scenes[role].width } as CSSProperties}
              src={`${sceneFolder}/${role}.png`}
              alt=''
              width={scenes[role].width}
              height={scenes[role].height}
              sizes='(max-width: 40rem) 100vw, 26rem'
            />
          </li>
        ))}
      </ul>
      <p className={styles.sideCaption}>{text.caption}</p>
    </div>
  );
}

/**
 * Show how COMQ's team connects mining companies with equipment suppliers.
 *
 * 1. Content and artwork
 *    All text comes from the dictionary, so both languages share the
 *    diagram. The scene images are decorative: each role's name, visible or
 *    visually hidden depending on the variant, says what its scene shows.
 *    Their paper and panel backgrounds are part of the artwork, so the
 *    diagram keeps that palette in both themes.
 *
 * 2. Layouts
 *    One document order serves both layouts: companies, COMQ team,
 *    suppliers, then the foundation note. Above the site's 640px mobile
 *    breakpoint, a CSS grid places them like the original artwork and scales
 *    every size with the component's width. At 640px and below they stack,
 *    and a smaller SVG fans the connections vertically through the hub.
 *    `NetworkConnections` draws both SVGs; this component places them.
 */
export function MiningNetwork({
  content,
  variant = 'labels'
}: {
  content: NetworkContent;
  variant?: MiningNetworkVariant;
}) {
  const headingId = `mining-network-${variant}`;
  return (
    <section className={styles.network} aria-labelledby={headingId}>
      <div className={styles.card}>
        <h2 className={styles.heading} id={headingId}>
          {content.heading}
        </h2>
        <div className={styles.stage}>
          <NetworkSide side={companies} content={content} variant={variant} />
          <div className={styles.hub}>
            <NetworkConnections
              layout='stacked'
              className={styles.stackedConnections}
            />
            <div className={styles.team}>
              <Image
                className={styles.teamImage}
                src={team.src}
                alt=''
                width={team.width}
                height={team.height}
                sizes='(max-width: 40rem) 60vw, 18rem'
              />
              <h3 className={styles.teamHeading}>{content.team.heading}</h3>
              <p className={styles.teamLines}>
                <span>{content.team.experience}</span>
                <span>{content.team.relationships}</span>
              </p>
            </div>
          </div>
          <NetworkSide side={suppliers} content={content} variant={variant} />
          <p className={styles.foundation}>{content.foundation}</p>
          <NetworkConnections layout='wide' className={styles.connections} />
        </div>
        <p className={styles.outcome}>{content.outcome}</p>
      </div>
    </section>
  );
}
