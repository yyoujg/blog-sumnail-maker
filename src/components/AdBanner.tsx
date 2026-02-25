import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT, ADSENSE_AD_SLOT } from '../constants.ts';

const COUPANG_IFRAME_SRC =
  'https://ads-partners.coupang.com/widgets.html?id=967371&template=carousel&trackingCode=AF2506117&subId=&width=680&height=140&tsource=';

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
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense push error', e);
    }
  }, [type]);

  const wrapperClass =
    'w-full flex flex-col items-center justify-center py-6 my-4 min-h-[140px] bg-gray-50 rounded-xl border border-gray-200';

  if (type === 'coupang') {
    return (
      <div className={wrapperClass} data-ad-position={position}>
        <iframe
          src={COUPANG_IFRAME_SRC}
          width="680"
          height="140"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 배너"
          className="max-w-full"
        />
      </div>
    );
  }

  if (!ADSENSE_AD_SLOT) {
    return (
      <div className={wrapperClass} data-ad-position={position}>
        <div className="flex items-center justify-center h-[140px] text-gray-400 text-sm">
          애드센스 광고 영역 (constants.ts에 ADSENSE_AD_SLOT을 입력하세요)
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
