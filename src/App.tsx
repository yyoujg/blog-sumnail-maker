import { useState, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { TextAlign, FrameType, BgType } from './types.ts';
import { useSeoAndScripts } from './hooks/useSeoAndScripts.ts';
import AdBanner from './components/AdBanner.tsx';
import ControlPanel from './components/ControlPanel.tsx';
import ThumbnailPreview from './components/ThumbnailPreview.tsx';

export default function App() {
  useSeoAndScripts();

  const [title, setTitle] = useState('블로그 포스팅 제목');
  const [subtitle, setSubtitle] = useState('여기에 서브 타이틀을 입력하세요');
  const [category, setCategory] = useState('카테고리');

  const [bgType, setBgType] = useState<BgType>('color');
  const [bgColor, setBgColor] = useState('#4F46E5');
  const [bgImage, setBgImage] = useState<string | null>(null);

  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontFamily, setFontFamily] = useState(`'Noto Sans KR', sans-serif`);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');

  const [overlayOpacity, setOverlayOpacity] = useState(20);
  const [frameType, setFrameType] = useState<FrameType>('none');

  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const target = event.target;
        if (target && typeof target.result === 'string') {
          setBgImage(target.result);
          setBgType('image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadThumbnail = async () => {
    if (!window.html2canvas) {
      alert(
        '이미지 생성 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.'
      );
      return;
    }
    const element = previewRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      await document.fonts.ready;
      const w = element.offsetWidth;
      const h = element.offsetHeight;
      element.style.setProperty('width', `${w}px`);
      element.style.setProperty('height', `${h}px`);
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: bgType === 'color' ? bgColor : '#ffffff',
      });
      element.style.removeProperty('width');
      element.style.removeProperty('height');
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'blog_thumbnail.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
      const message =
        error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`이미지 다운로드에 실패했습니다. (${message})`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8 flex flex-col">
      <header className="max-w-6xl mx-auto mb-4 text-center md:text-left w-full">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
          <ImageIcon className="w-8 h-8 text-indigo-600" />
          네이버 블로그 썸네일 메이커
        </h1>
        <p className="text-gray-500 mt-2">
          1:1 비율의 깔끔한 썸네일을 1분 만에 완성해보세요.
        </p>
      </header>

      <div className="max-w-6xl mx-auto w-full">
        <AdBanner position="상단" />
      </div>

      <main className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8 flex-1">
        <ControlPanel
          title={title}
          setTitle={setTitle}
          subtitle={subtitle}
          setSubtitle={setSubtitle}
          category={category}
          setCategory={setCategory}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          textColor={textColor}
          setTextColor={setTextColor}
          textAlign={textAlign}
          setTextAlign={setTextAlign}
          bgType={bgType}
          setBgType={setBgType}
          bgColor={bgColor}
          setBgColor={setBgColor}
          bgImage={bgImage}
          setBgImage={setBgImage}
          onImageUpload={handleImageUpload}
          overlayOpacity={overlayOpacity}
          setOverlayOpacity={setOverlayOpacity}
          frameType={frameType}
          setFrameType={setFrameType}
        />

        <ThumbnailPreview
          previewRef={previewRef}
          title={title}
          subtitle={subtitle}
          category={category}
          textColor={textColor}
          fontFamily={fontFamily}
          textAlign={textAlign}
          bgType={bgType}
          bgColor={bgColor}
          bgImage={bgImage}
          overlayOpacity={overlayOpacity}
          frameType={frameType}
          onDownload={downloadThumbnail}
          isDownloading={isDownloading}
        />
      </main>

      <div className="max-w-6xl mx-auto w-full mt-8">
        <AdBanner position="하단" />
        <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200 mt-4">
          <p>
            © {new Date().getFullYear()} 네이버 블로그 썸네일 메이커. All rights
            reserved.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            문의 및 제휴: andn1026@gmail.com
          </p>
        </footer>
      </div>
    </div>
  );
}
