import {
  Type,
  Palette,
  Square,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import type { TextAlign, FrameType, BgType } from '../types.ts';
import { FONTS } from '../constants.ts';

interface ControlPanelProps {
  title: string;
  setTitle: (v: string) => void;
  subtitle: string;
  setSubtitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  textColor: string;
  setTextColor: (v: string) => void;
  textAlign: TextAlign;
  setTextAlign: (v: TextAlign) => void;
  bgType: BgType;
  setBgType: (v: BgType) => void;
  bgColor: string;
  setBgColor: (v: string) => void;
  bgImage: string | null;
  setBgImage: (v: string | null) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  overlayOpacity: number;
  setOverlayOpacity: (v: number) => void;
  frameType: FrameType;
  setFrameType: (v: FrameType) => void;
}

export default function ControlPanel({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  category,
  setCategory,
  fontFamily,
  setFontFamily,
  textColor,
  setTextColor,
  textAlign,
  setTextAlign,
  bgType,
  setBgType,
  bgColor,
  setBgColor,
  bgImage,
  setBgImage,
  onImageUpload,
  overlayOpacity,
  setOverlayOpacity,
  frameType,
  setFrameType,
}: ControlPanelProps) {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8 h-fit">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
          <Type className="w-5 h-5" /> 텍스트 입력
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 (선택)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-blue-500 outline-none transition"
              placeholder="예: 맛집 탐방, IT 리뷰"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메인 제목
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="포스팅 제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              서브 제목 (선택)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-blue-500 outline-none transition"
              placeholder="보충 설명을 입력하세요"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
          <Palette className="w-5 h-5" /> 폰트 및 정렬
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              폰트 선택
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg outline-none"
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              글자 색상
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-10 p-1 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{textColor}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            텍스트 정렬
          </label>
          <div className="flex gap-2">
            {(
              [
                { value: 'left' as const, icon: <AlignLeft className="w-4 h-4" /> },
                {
                  value: 'center' as const,
                  icon: <AlignCenter className="w-4 h-4" />,
                },
                { value: 'right' as const, icon: <AlignRight className="w-4 h-4" /> },
              ] as const
            ).map((align) => (
              <button
                key={align.value}
                onClick={() => setTextAlign(align.value)}
                className={`flex-1 flex justify-center p-2 rounded border ${textAlign === align.value ? 'bg-gray-100 border-blue-500 text-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                {align.icon}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
          <Square className="w-5 h-5" /> 배경 및 꾸미기
        </h2>
        <div className="space-y-3">
          <div className="flex gap-4 mb-2">
            <button
              onClick={() => setBgType('color')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${bgType === 'color' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              단색 배경
            </button>
            <button
              onClick={() => setBgType('image')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${bgType === 'image' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              이미지 배경
            </button>
          </div>

          {bgType === 'color' ? (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                배경 색상
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-full p-1 rounded border border-gray-300 cursor-pointer"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                배경 이미지 업로드
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition relative overflow-hidden">
                {bgImage ? (
                  <>
                    <img
                      src={bgImage}
                      alt="배경 미리보기"
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="relative z-10 flex flex-col items-center bg-white/80 p-2 rounded">
                      <ImageIcon className="w-6 h-6 text-gray-500 mb-1" />
                      <span className="text-sm font-medium text-gray-700">
                        이미지 변경
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      클릭하여 이미지 업로드
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onImageUpload}
                />
              </label>
              {bgImage && (
                <button
                  onClick={() => setBgImage(null)}
                  className="text-xs text-red-500 flex items-center gap-1 mt-1 hover:underline"
                >
                  <Trash2 className="w-3 h-3" /> 이미지 제거
                </button>
              )}
            </div>
          )}

          <div className="pt-2">
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>어두운 필터 (가독성 향상)</span>
              <span>{overlayOpacity}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              테두리 프레임
            </label>
            <select
              value={frameType}
              onChange={(e) => setFrameType(e.target.value as FrameType)}
              className="w-full p-2 border border-gray-300 rounded-lg outline-none"
            >
              <option value="none">없음</option>
              <option value="solid">실선 테두리</option>
              <option value="double">이중선 테두리</option>
              <option value="corners">모서리 포인트</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
