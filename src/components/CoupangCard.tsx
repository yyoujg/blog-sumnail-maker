interface CoupangCardProps {
  src: string;
  name: string;
  desc: string;
}

export default function CoupangCard({ src, name, desc }: CoupangCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 my-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <iframe
          src={src}
          width="300"
          height="250"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title={name}
          className="flex-shrink-0 w-full sm:w-[300px]"
        />
        <div className="flex flex-col justify-center gap-2">
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          <p className="text-xs text-gray-300 mt-1">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 받을 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
