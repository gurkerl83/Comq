import Image from 'next/image';

import type { NetworkContent, NetworkRoleId } from '../../lib/i18n/types';
import styles from './MiningNetwork.module.css';
import { NetworkConnections } from './NetworkConnections';

/**
 * - labels: each scene has its role label above it.
 * - roleList: each panel header lists its roles; the scenes are unlabeled.
 */
export type MiningNetworkVariant = 'labels' | 'roleList';

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

/** Transparent scene assets served from public for both layout variants. */
const scenes: Record<NetworkRoleId, string> = {
  operations: '/images/company/network/operations-transparent.png',
  maintenance: '/images/company/network/maintenance-transparent.png',
  procurement: '/images/company/network/procurement-transparent.png',
  sales: '/images/company/network/sales-transparent.png',
  engineering: '/images/company/network/engineering-transparent.png',
  service: '/images/company/network/service-transparent.png'
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
            {side.roles.map(role => (
              <span key={role}>• {content.roles[role]}</span>
            ))}
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
              src={scenes[role]}
              width={360}
              height={160}
              alt=''
              unoptimized
            />
          </li>
        ))}
      </ul>
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
 *    Transparent artwork lets CSS supply the panel backgrounds. The drawings
 *    retain their opaque object fills and the diagram's palette in both themes.
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
    <section
      className={styles.network}
      data-variant={variant}
      aria-labelledby={headingId}
    >
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
                src='/images/company/network/comq-team-transparent.png'
                width={360}
                height={180}
                alt=''
                unoptimized
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
