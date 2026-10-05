/** A point in a layout's SVG units. */
type Point = { x: number; y: number };

/** The ring's centre and radius, in a layout's SVG units. */
type Ring = Point & { radius: number };

/** One connection: a dot in a panel and the point where it meets the ring. */
type Spoke = { outer: Point; inner: Point };

/**
 * Which way the panels sit relative to the ring: beside it (`'horizontal'`)
 * or above and below it (`'vertical'`).
 */
type Axis = 'horizontal' | 'vertical';

/**
 * Line widths and dot radii as fractions of the ring radius, so both layouts
 * draw the same proportions at their own scale.
 */
const SIZE = {
  /** Width of the ring's outline. */
  ring: 0.018,
  /** Width of each spoke. */
  spoke: 0.012,
  /** Radius of the dot at each end of a spoke. */
  dot: 0.045
};

/*
 * Wide layout, in units of the 1536-unit artwork grid. The SVG covers the
 * hub's grid row, three contact rows high, across the full width.
 */

/** Width of the artwork grid. */
const GRID_WIDTH = 1536;

/**
 * Height of one contact row. The ring's radius equals it, so the ring reaches
 * from the top row's centre to the bottom row's centre.
 */
const ROW_PITCH = 202;

/** Height of the three contact rows the wide SVG covers. */
const ROWS_HEIGHT = 3 * ROW_PITCH;

/** The ring, centred in the grid and in the middle contact row. */
const WIDE_RING: Ring = {
  x: GRID_WIDTH / 2,
  y: ROWS_HEIGHT / 2,
  radius: ROW_PITCH
};

/**
 * Each panel's horizontal layout, matching the `.stage` columns and the
 * `--dot-zone` padding in the component's CSS.
 */
const PANEL = {
  /** Space between the card's edge and the panel. */
  margin: 40,
  /** Width of the panel. */
  width: 476,
  /** Zone along the panel's inner edge; the connection dot sits in its middle. */
  dotZone: 60
};

/**
 * Distance from the ring's centre to the dots beside it, so each dot sits in
 * the middle of its panel's dot zone.
 */
const WIDE_REACH =
  GRID_WIDTH / 2 - (PANEL.margin + PANEL.width) + PANEL.dotZone / 2;

/**
 * Angle between the straight spoke and each slanted spoke of a panel. It
 * follows from the wide layout, where neighbouring dots are one contact row
 * apart, and the stacked layout reuses it, so both fan alike (about 35.6°).
 */
const SPOKE_ANGLE = Math.atan(ROW_PITCH / WIDE_REACH);

/** Arrow from the ring down to the foundation note, in grid units. */
const ARROW = {
  /** Space between the ring's outline and the arrow tip. */
  gap: 3,
  /** Length of the arrow head. */
  headLength: 16,
  /** Half the width of the arrow head's base. */
  headHalfWidth: 9,
  /** Width of the shaft. */
  shaftWidth: 3,
  /** Space between the shaft's end and the bottom of the SVG. */
  bottomGap: 8
};

/*
 * Stacked layout, in units of the 200 × 174 hub area: the same drawing,
 * turned upright and scaled to the hub.
 */

/** The hub area the stacked SVG covers. */
const STACKED_AREA = { width: 200, height: 174 };

/**
 * The ring, centred in the hub area. Its radius is 34% of the area's width,
 * matching `--hub-radius: 34cqi` in the component's CSS.
 */
const STACKED_RING: Ring = {
  x: STACKED_AREA.width / 2,
  y: STACKED_AREA.height / 2,
  radius: 0.34 * STACKED_AREA.width
};

/**
 * Height of the bands the CSS adds above and below the hub for the outer dots
 * (`21 / 200` of the hub's width in `.companies` and `.suppliers`).
 */
const STACKED_DOT_BAND = 21;

/**
 * Distance from the ring's centre to each panel's dots, so each dot sits in
 * the middle of its band above or below the hub area.
 */
const STACKED_REACH = STACKED_AREA.height / 2 + STACKED_DOT_BAND / 2;

/**
 * Find where the line from a panel dot to the ring's centre crosses the ring,
 * so each spoke ends exactly on the ring.
 *
 * @param outer - The spoke's dot in a panel, in the layout's SVG units.
 * @param ring - The ring the spoke points at, in the same units.
 * @returns The point on the ring that faces `outer`.
 */
function ringPoint(outer: Point, ring: Ring): Point {
  const dx = outer.x - ring.x;
  const dy = outer.y - ring.y;
  const length = Math.hypot(dx, dy);
  return {
    x: ring.x + (dx / length) * ring.radius,
    y: ring.y + (dy / length) * ring.radius
  };
}

/**
 * Build the six spokes of one layout: three per panel, one straight towards
 * the ring and two at `SPOKE_ANGLE` on either side of it.
 *
 * 1. Each panel's dots sit `reach` from the ring's centre along `axis`.
 * 2. Neighbouring dots are `reach × tan(SPOKE_ANGLE)` apart across it, which
 *    gives the slanted spokes their angle.
 * 3. Every spoke ends where its line to the centre meets the ring.
 *
 * @param ring - The ring the spokes point at.
 * @param reach - Distance from the ring's centre to each panel's dots.
 * @param axis - Whether the panels sit beside the ring or above and below it.
 * @returns The first panel's three spokes, then the second panel's three.
 *
 * @example
 * // The wide layout's dots sit in the dot zones, one contact row apart:
 * // fanSpokes(WIDE_RING, WIDE_REACH, 'horizontal')
 */
function fanSpokes(ring: Ring, reach: number, axis: Axis): Spoke[] {
  const spread = reach * Math.tan(SPOKE_ANGLE);
  return [-1, 1].flatMap(side =>
    [-1, 0, 1].map(step => {
      const along = side * reach;
      const across = step * spread;
      const outer =
        axis === 'horizontal'
          ? { x: ring.x + along, y: ring.y + across }
          : { x: ring.x + across, y: ring.y + along };
      return { outer, inner: ringPoint(outer, ring) };
    })
  );
}

/** Wide spokes: the dots line up with the centres of the contact rows. */
const WIDE_SPOKES = fanSpokes(WIDE_RING, WIDE_REACH, 'horizontal');

/** Stacked spokes: the dots sit in the bands above and below the hub. */
const STACKED_SPOKES = fanSpokes(STACKED_RING, STACKED_REACH, 'vertical');

/**
 * Round an SVG coordinate or length to two decimals.
 *
 * @param value - A coordinate or length in SVG units.
 * @returns The value with at most two decimals, which keeps the markup short
 *   without a visible difference.
 */
const round = (value: number) => Number(value.toFixed(2));

/**
 * Draw a ring and its spokes in `currentColor`. Line widths and dot sizes
 * follow the ring's radius.
 *
 * @param props.ring - The ring to draw, in the SVG's units.
 * @param props.spokes - The spokes to draw, from `fanSpokes`.
 * @returns The ring's outline and one group per spoke.
 */
function RingAndSpokes({ ring, spokes }: { ring: Ring; spokes: Spoke[] }) {
  const dot = round(ring.radius * SIZE.dot);
  return (
    <>
      <circle
        cx={round(ring.x)}
        cy={round(ring.y)}
        r={round(ring.radius)}
        fill='none'
        stroke='currentColor'
        strokeWidth={round(ring.radius * SIZE.ring)}
      />
      {spokes.map(({ outer, inner }) => (
        <g key={`${outer.x},${outer.y}`}>
          <line
            x1={round(outer.x)}
            y1={round(outer.y)}
            x2={round(inner.x)}
            y2={round(inner.y)}
            stroke='currentColor'
            strokeWidth={round(ring.radius * SIZE.spoke)}
          />
          <circle
            cx={round(outer.x)}
            cy={round(outer.y)}
            r={dot}
            fill='currentColor'
          />
          <circle
            cx={round(inner.x)}
            cy={round(inner.y)}
            r={dot}
            fill='currentColor'
          />
        </g>
      ))}
    </>
  );
}

/**
 * Draw the arrow from the bottom of the wide ring down to the foundation note.
 * The shaft starts inside the head, which is drawn over it, so no seam shows.
 *
 * @returns The shaft and the arrow head in `currentColor`.
 */
function FoundationArrow() {
  const x = WIDE_RING.x;
  const tip =
    WIDE_RING.y +
    WIDE_RING.radius +
    (WIDE_RING.radius * SIZE.ring) / 2 +
    ARROW.gap;
  return (
    <>
      <line
        x1={x}
        y1={round(tip + ARROW.headLength / 2)}
        x2={x}
        y2={ROWS_HEIGHT - ARROW.bottomGap}
        stroke='currentColor'
        strokeWidth={ARROW.shaftWidth}
      />
      <path
        d={`M${x} ${round(tip)}l${-ARROW.headHalfWidth} ${ARROW.headLength}h${2 * ARROW.headHalfWidth}z`}
        fill='currentColor'
      />
    </>
  );
}

/**
 * Draw the connections between the COMQ team and the six roles.
 *
 * 1. Wide layout: the ring around the team, a spoke to the dot beside each
 *    role and the arrow down to the foundation note. The SVG spans the
 *    diagram's contact rows in units of the 1536-unit artwork grid.
 * 2. Stacked layout: the same ring and spokes turned upright and scaled to the
 *    200 × 174 hub area. The outer dots reach into the panels above and below
 *    through the SVG's visible overflow.
 *
 * The drawing is decorative, so it is hidden from assistive technology. The
 * parent places, sizes and colours it through `className`.
 *
 * @param props.layout - Which layout to draw.
 * @param props.className - Placement, size and colour from the parent's CSS.
 * @returns The SVG for the chosen layout.
 */
export function NetworkConnections({
  layout,
  className
}: {
  layout: 'wide' | 'stacked';
  className?: string;
}) {
  if (layout === 'stacked') {
    return (
      <svg
        className={className}
        viewBox={`0 0 ${STACKED_AREA.width} ${STACKED_AREA.height}`}
        aria-hidden='true'
        focusable='false'
      >
        <RingAndSpokes ring={STACKED_RING} spokes={STACKED_SPOKES} />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox={`0 0 ${GRID_WIDTH} ${ROWS_HEIGHT}`}
      aria-hidden='true'
      focusable='false'
    >
      <RingAndSpokes ring={WIDE_RING} spokes={WIDE_SPOKES} />
      <FoundationArrow />
    </svg>
  );
}
