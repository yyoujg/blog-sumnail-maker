interface CoupangCardProps {
  src: string;
  name: string;
  desc: string;
}

export default function CoupangCard({ src, name, desc }: CoupangCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 my-6 flex flex-col items-center gap-3 overflow-hidden">
      <p className="w-full text-sm font-semibold text-gray-800">{name}</p>
      <div className="w-full overflow-x-auto flex justify-center">
        <iframe
          src={src}
          width="300"
          height="250"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title={name}
        />
      </div>
      <p className="w-full text-xs text-gray-500 leading-relaxed">{desc}</p>
      <p className="w-full text-xs text-gray-300">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 받을 수 있습니다.
      </p>
    </div>
  );
}
