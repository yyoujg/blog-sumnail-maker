interface CoupangCardProps {
  src: string;
  name: string;
  desc: string;
}

export default function CoupangCard({ src, name, desc }: CoupangCardProps) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4 my-6">
      <iframe
        src={src}
        width="120"
        height="240"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        title={name}
        className="flex-shrink-0"
      />
      <div className="flex flex-col justify-center gap-2 py-2">
        <p className="text-sm font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        <p className="text-xs text-gray-300 mt-1">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 받을 수 있습니다.
        </p>
      </div>
    </div>
  );
}
