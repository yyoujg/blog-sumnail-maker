interface AdBannerProps {
  position: string;
}

export default function AdBanner({ position }: AdBannerProps) {
  return (
    <div className="hidden w-full bg-gray-200 border-2 border-gray-300 border-dashed rounded-xl flex items-center justify-center text-gray-400 py-6 my-4 hover:bg-gray-300 transition-colors">
      <div className="text-center">
        <p className="font-bold text-sm mb-1">광고 배너 영역 ({position})</p>
        <p className="text-xs">
          여기에 구글 애드센스 또는 쿠팡 파트너스 코드를 삽입하세요.
        </p>
      </div>
    </div>
  );
}
