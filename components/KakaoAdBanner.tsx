'use client';

import { useEffect, useRef } from 'react';

export default function KakaoAdBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('ins')) return;
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', 'DAN-Ze4aOvumQHtpTKt4');
    ins.setAttribute('data-ad-width', '728');
    ins.setAttribute('data-ad-height', '90');
    ref.current.appendChild(ins);
  }, []);

  return <div ref={ref} className="w-full flex justify-center my-4" />;
}
