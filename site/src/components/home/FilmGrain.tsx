'use client';

/**
 * FilmGrain — reusable cinematic noise overlay.
 * Inline SVG via <feTurbulence>, encoded as a data URL.
 * Defaults: full-bleed, pointer-events none, low opacity.
 *
 * Place absolutely within a positioned parent. Set `fixed` for a viewport-wide overlay.
 */
export default function FilmGrain({
  opacity = 0.035,
  zIndex = 5,
  fixed = false,
  blendMode = 'overlay',
}: {
  opacity?: number;
  zIndex?: number;
  fixed?: boolean;
  blendMode?: React.CSSProperties['mixBlendMode'];
}) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)'/>
  </svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

  return (
    <div
      aria-hidden
      style={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex,
        opacity,
        mixBlendMode: blendMode,
        backgroundImage: url,
        backgroundSize: '300px 300px',
      }}
    />
  );
}
