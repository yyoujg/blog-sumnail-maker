const COUPANG_IFRAME_SRC =
  'https://ads-partners.coupang.com/widgets.html?id=967371&template=carousel&trackingCode=AF2506117&subId=&width=680&height=140&tsource=';

interface AdBannerProps {
  position: string;
}

export default function AdBanner({ position }: AdBannerProps) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center py-6 my-4 min-h-[140px] bg-gray-50 rounded-xl border border-gray-200"
      data-ad-position={position}
    >
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
