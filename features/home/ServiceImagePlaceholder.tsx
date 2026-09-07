/** Inline SVG inherits theme colors; an external image cannot inherit page styles. */
export function ServiceImagePlaceholder({
  alt,
  className
}: {
  alt: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      role='img'
      aria-label={alt}
      focusable='false'
      width={800}
      height={500}
      viewBox='0 0 800 500'
      fill='none'
    >
      <g
        stroke='currentColor'
        strokeWidth={3}
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={0.5}
      >
        <rect x={310} y={185} width={180} height={130} rx={12} />
        <circle cx={360} cy={222} r={13} />
        <path d='m310 288 52-48 39 36 34-29 55 51' />
      </g>
    </svg>
  );
}
