import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  Palette,
  Download,
  Type,
  Layers,
} from 'lucide-react';
import type { TextAlign, FrameType, BgType } from './types.ts';
import { useSeoAndScripts } from './hooks/useSeoAndScripts.ts';
import ControlPanel from './components/ControlPanel.tsx';
import ThumbnailPreview from './components/ThumbnailPreview.tsx';
import CoupangCard from './components/CoupangCard.tsx';
import KakaoAdBanner from './components/KakaoAdBanner.tsx';
import { blogPosts } from './data/blogPosts.ts';

const FAQ_ITEMS = [
  {
    q: '이 서비스는 무료인가요?',
    a: '완전 무료입니다. 회원가입, 로그인, 결제가 전혀 필요 없습니다. 지금 바로 사용하세요.',
  },
  {
    q: '회원가입이 필요한가요?',
    a: '필요 없습니다. 사이트에 접속하면 바로 썸네일 제작을 시작할 수 있습니다.',
  },
  {
    q: '생성한 이미지는 어디에 저장되나요?',
    a: '이미지는 서버에 저장되지 않습니다. 다운로드 버튼을 누르면 내 기기에 바로 저장됩니다. 업로드한 배경 이미지도 브라우저 안에서만 처리됩니다.',
  },
  {
    q: '모바일에서도 사용할 수 있나요?',
    a: '네, PC와 모바일 모두 지원합니다. 다만 세밀한 설정은 PC 환경에서 더 편리합니다.',
  },
  {
    q: '상업적으로 사용해도 되나요?',
    a: '생성한 썸네일 이미지는 자유롭게 사용하실 수 있습니다. 단, 배경으로 업로드한 이미지의 저작권은 원저작자에게 있으니 저작권법을 준수해 주세요.',
  },
  {
    q: '추천 썸네일 크기는 어떻게 되나요?',
    a: '네이버 블로그 포스팅 대표 이미지는 1:1 비율(600×600px 이상)을 권장합니다. 본 메이커는 2배 해상도(약 720×720px)로 PNG를 생성하므로 모바일에서도 선명하게 보입니다.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function App() {
  useSeoAndScripts();

  const [title, setTitle] = useState('블로그 포스팅 제목');
  const [subtitle, setSubtitle] = useState('여기에 서브 타이틀을 입력하세요');
  const [category, setCategory] = useState('카테고리');

  const [bgType, setBgType] = useState<BgType>('color');
  const [bgColor, setBgColor] = useState('#111827');
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
      alert('이미지 생성 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
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
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`이미지 다운로드에 실패했습니다. (${message})`);
    } finally {
      setIsDownloading(false);
    }
  };

  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">

      {/* ── 히어로 섹션 ── */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-14 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-5">
            <ImageIcon className="w-3.5 h-3.5" />
            완전 무료 · 로그인 불필요
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            네이버 블로그 썸네일을<br className="hidden md:block" /> 빠르게 만드는 무료 생성기
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            포토샵 없이 1분 안에 완성. 카테고리·제목·배경색만 입력하면 1:1 고해상도 PNG를 바로
            다운로드할 수 있습니다. 네이버 블로그 포스팅마다 썸네일 때문에 시간을 낭비하지 마세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {['가입·설치 없음', '고해상도 PNG', '모바일 지원', '배경 이미지 업로드'].map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 썸네일 생성기 툴 ── */}
      <section id="tool" className="py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">썸네일 만들기</h2>
          <p className="text-gray-500 text-center text-sm mb-8">
            아래에서 직접 입력하고 미리보기를 확인한 뒤 다운로드하세요.
          </p>
          <div className="flex flex-col lg:flex-row gap-8">
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
          </div>
        </div>
      </section>


      {/* ── 이런 분께 유용해요 ── */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            이런 분께 특히 유용해요
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10">
            썸네일 하나로 클릭률이 달라집니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Palette className="w-6 h-6 text-gray-900" />,
                title: '디자인 도구가 낯선 초보 블로거',
                desc: '포토샵·캔바 없이도 전문적인 느낌의 썸네일을 만들 수 있습니다. 클릭 몇 번으로 완성됩니다.',
              },
              {
                icon: <Type className="w-6 h-6 text-gray-900" />,
                title: '매일 포스팅하는 파워블로거',
                desc: '포스팅마다 썸네일 만드는 시간이 아깝다면? 1분 만에 일관된 스타일로 빠르게 제작하세요.',
              },
              {
                icon: <Layers className="w-6 h-6 text-gray-900" />,
                title: '브랜드 이미지를 통일하고 싶은 블로거',
                desc: '동일한 색상·폰트·레이아웃으로 썸네일을 만들면 블로그가 브랜드처럼 보입니다.',
              },
            ].map((card, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 썸네일 제작 팁 ── */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">썸네일 제작 팁</h2>
          <p className="text-gray-500 text-center text-sm mb-10">
            이것만 지켜도 클릭률이 달라집니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: <Download className="w-5 h-5 text-gray-900" />,
                title: '추천 사이즈: 600×600px 이상',
                desc: '네이버 블로그 대표 이미지는 1:1 비율(600×600px 이상)이 가장 안정적입니다. 본 메이커는 2배 해상도로 저장하므로 모바일에서도 선명합니다.',
              },
              {
                icon: <Type className="w-5 h-5 text-gray-900" />,
                title: '텍스트는 15자 이내',
                desc: '목록에서 썸네일은 작게 보입니다. 긴 문장은 읽히지 않으니 핵심 키워드 위주로 짧고 굵게 입력하세요.',
              },
              {
                icon: <Palette className="w-5 h-5 text-gray-900" />,
                title: '배경과 텍스트 대비를 높여라',
                desc: '어두운 배경에는 흰색 텍스트, 밝은 배경에는 검정 텍스트. 배경 이미지 위에는 오버레이를 20~50% 적용하면 가독성이 확보됩니다.',
              },
              {
                icon: <Layers className="w-5 h-5 text-gray-900" />,
                title: '카테고리 레이블을 활용하세요',
                desc: '"요리", "여행", "리뷰" 같은 카테고리를 썸네일에 넣으면 방문자가 글의 주제를 즉시 파악합니다. 서브타이틀 영역을 활용해보세요.',
              },
            ].map((tip, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 썸네일 팁 하단 상품 ── */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto -mt-4">
        <CoupangCard
          src="https://coupa.ng/clQwSN"
          name="셀루미 초경량 스마트폰 삼각대"
          desc="배경 사진 직접 찍어 쓰는 분들께 추천해요. 손떨림 없이 고정된 앵글로 찍으면 썸네일 소스 퀄리티가 확 달라집니다."
        />
      </div>

      {/* ── FAQ ── */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">자주 묻는 질문</h2>
          <p className="text-gray-500 text-center text-sm mb-8">
            궁금한 점이 있으시면 아래를 확인해 주세요.
          </p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            더 궁금한 점은{' '}
            <Link to="/contact" className="text-gray-900 hover:underline">
              문의 페이지
            </Link>
            에서 이메일로 보내주세요.
          </p>
        </div>
      </section>

      {/* ── FAQ 하단 상품 ── */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto -mt-4">
        <CoupangCard
          src="https://coupa.ng/clQwZb"
          name="라이프썸 미니 블루투스 키보드"
          desc="태블릿으로 블로그 포스팅하는 분들께 딱 맞아요. 3대 멀티 페어링에 C타입 충전까지 되어서 하나 사두면 오래 씁니다."
        />
      </div>

      {/* ── 블로그 최신 글 ── */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">썸네일 제작 가이드</h2>
              <p className="text-gray-500 text-sm mt-1">더 잘 만들기 위한 팁을 읽어보세요.</p>
            </div>
            <Link
              to="/blog"
              className="flex items-center gap-1 text-sm text-gray-900 hover:underline font-medium"
            >
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-900 transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 페이지 최하단 카카오 광고 ── */}
      <div className="w-full bg-white border-t border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <KakaoAdBanner />
        </div>
      </div>

      {/* ── 푸터 ── */}
      <footer className="bg-gray-800 text-gray-400 text-sm py-10 px-4 md:px-8 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                네이버 블로그 썸네일 메이커
              </div>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                누구나 무료로 사용할 수 있는 블로그 썸네일 생성기. 가입·설치 없이 바로 시작하세요.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2 text-xs">
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/blog" className="hover:text-white transition-colors">블로그</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">개인정보 처리방침</Link>
              <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <Link to="/contact" className="hover:text-white transition-colors">문의</Link>
            </nav>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} 네이버 블로그 썸네일 메이커. All rights reserved.</p>
            <p className="mt-1">문의 및 제휴: andn1026@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
