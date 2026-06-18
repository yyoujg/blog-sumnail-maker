import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<rect width="32" height="32" rx="6" fill="#111827"/>
<rect x="5" y="7" width="22" height="16" rx="2" fill="white" opacity="0.15"/>
<rect x="5" y="7" width="22" height="16" rx="2" fill="none" stroke="white" stroke-width="1.5"/>
<polygon points="9,19 14,12 17,16 20,13 25,19" fill="white" opacity="0.9"/>
<circle cx="22" cy="11" r="2" fill="#fbbf24"/>
<rect x="5" y="26" width="14" height="2" rx="1" fill="white" opacity="0.7"/>
<rect x="5" y="29" width="10" height="2" rx="1" fill="white" opacity="0.5"/>
</svg>`;

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={size.width}
          height={size.height}
          src={`data:image/svg+xml,${encodeURIComponent(SVG)}`}
          alt="BlogKit"
        />
      </div>
    ),
    { ...size },
  );
}
