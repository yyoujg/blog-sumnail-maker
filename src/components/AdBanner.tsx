import { useEffect, useRef } from 'react';

const COUPANG_SCRIPT_SRC = 'https://ads-partners.coupang.com/g.js';
const COUPANG_CONFIG = {
  id: '967371',
  template: 'carousel',
  trackingCode: 'AF2506117',
  width: '680',
  height: '140',
  tsource: '',
};

interface AdBannerProps {
  position: string;
}

declare global {
  interface Window {
    PartnersCoupang?: {
      G: (config: typeof COUPANG_CONFIG) => void;
    };
  }
}

export default function AdBanner({ position }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const init = () => {
      if (window.PartnersCoupang) {
        window.PartnersCoupang.G(COUPANG_CONFIG);
      }
    };

    if (window.PartnersCoupang) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.src = COUPANG_SCRIPT_SRC;
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);

    return () => {
      const existing = document.querySelector(
        `script[src="${COUPANG_SCRIPT_SRC}"]`
      );
      if (existing?.parentNode && document.body.contains(existing)) {
        existing.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center py-6 my-4 min-h-[140px] bg-gray-50 rounded-xl border border-gray-200"
      data-ad-position={position}
    >
      <div id="coupang-partner-banner" className="w-full max-w-[680px]" />
    </div>
  );
}
