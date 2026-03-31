'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT, ADSENSE_AD_SLOT } from '@/lib/constants';

const TRACKING_CODE = 'AF2506117';

function coupangUrl(subId: string, width: number, height: number) {
  return `https://ads-partners.coupang.com/widgets.html?id=967371&template=carousel&trackingCode=${TRACKING_CODE}&subId=${subId}&width=${width}&height=${height}&tsource=`;
}

type BannerType = 'adsense' | 'coupang';

interface AdBannerProps {
  position: string;
  type: BannerType;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBanner({ position, type }: AdBannerProps) {
  const adsenseRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (type !== 'adsense' || !ADSENSE_AD_SLOT || !adsenseRef.current) return;
    if (adsenseRef.current.offsetWidth === 0) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense push error', e);
    }
  }, [type]);

  const wrapperClass =
    'w-full flex flex-col items-center justify-center py-4 my-4 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden';

  if (type === 'coupang') {
    const subId = encodeURIComponent(position);
    return (
      <div className={wrapperClass} data-ad-position={position}>
        <iframe
          src={coupangUrl(subId, 680, 140)}
          width="680"
          height="140"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 배너"
          className="hidden md:block max-w-full"
        />
        <iframe
          src={coupangUrl(subId + '_m', 320, 100)}
          width="320"
          height="100"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 배너"
          className="block md:hidden max-w-full"
        />
      </div>
    );
  }

  if (!ADSENSE_AD_SLOT) {
    return (
      <div className={wrapperClass} data-ad-position={position}>
        <div className="flex items-center justify-center h-[100px] text-gray-400 text-sm">
          애드센스 광고 영역
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass} data-ad-position={position}>
      <ins
        ref={adsenseRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
