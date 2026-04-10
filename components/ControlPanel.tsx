'use client';

import { useRef, useState } from 'react';
import {
  Type,
  Palette,
  Square,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
} from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType } from '@/lib/types';
import { FONTS } from '@/lib/constants';

const TEXT_COLORS = ['#ffffff', '#f5f5f0', '#111111', '#334155', '#fdcb6e', '#fd79a8', '#74b9ff', '#55efc4'];
const BG_COLORS = ['#111827', '#1a1a2e', '#0a3d62', '#2d3436', '#6c5ce7', '#00b894', '#e17055', '#fdcb6e', '#ffffff', '#f8f8f8', '#dfe6e9', '#fab1a0'];

interface ControlPanelProps {
  title: string;
  setTitle: (v: string) => void;
  subtitle: string;
  setSubtitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categoryOptions?: readonly string[];
  fontFamily: string;
  setFontFamily: (v: string) => void;
  textColor: string;
  setTextColor: (v: string) => void;
  textAlign: TextAlign;
  setTextAlign: (v: TextAlign) => void;
  textVAlign: TextVAlign;
  setTextVAlign: (v: TextVAlign) => void;
  textOffsetX: number;
  setTextOffsetX: (v: number) => void;
  textOffsetY: number;
  setTextOffsetY: (v: number) => void;
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
  titleFontSize?: number;
  setTitleFontSize?: (v: number) => void;
}

function ColorSwatches({
  colors,
  selected,
  onSelect,
}: {
  colors: string[];
  selected: string;
  onSelect: (c: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustom = !colors.includes(selected.toLowerCase()) && !colors.map(c => c.toLowerCase()).includes(selected.toLowerCase());

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          title={c}
          onClick={() => onSelect(c)}
          className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex-shrink-0"
          style={{
            backgroundColor: c,
            border: selected.toLowerCase() === c.toLowerCase() ? '3px solid #1e293b' : '2px solid #e2e8f0',
            outline: selected.toLowerCase() === c.toLowerCase() ? '2px solid #94a3b8' : 'none',
            outlineOffset: 2,
          }}
        />
      ))}
      {/* Custom picker */}
      <label
        className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors relative overflow-hidden flex-shrink-0"
        title="직접 선택"
        style={isCustom ? { border: '3px solid #1e293b', backgroundColor: selected } : {}}
      >
        {!isCustom && <Plus className="w-3.5 h-3.5 text-gray-400" />}
        <input
          ref={inputRef}
          type="color"
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
    </div>
  );
}

export default function ControlPanel({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  category,
  setCategory,
  categoryOptions,
  fontFamily,
  setFontFamily,
  textColor,
  setTextColor,
  textAlign,
  setTextAlign,
  textVAlign,
  setTextVAlign,
  textOffsetX,
  setTextOffsetX,
  textOffsetY,
  setTextOffsetY,
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
  titleFontSize,
  setTitleFontSize,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'bg'>('text');

  const TABS = [
    { id: 'text' as const, label: '텍스트', icon: <Type className="w-4 h-4" /> },
    { id: 'style' as const, label: '스타일', icon: <Palette className="w-4 h-4" /> },
    { id: 'bg' as const, label: '배경', icon: <Square className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 h-fit">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-5 space-y-4">

        {/* ── 텍스트 탭 ── */}
        {activeTab === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 (선택)</label>
              {categoryOptions && categoryOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCategory(opt)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition ${
                        category === opt
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none transition"
                placeholder="예: 맛집 탐방, IT 리뷰"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">메인 제목</label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none transition resize-none"
                placeholder="포스팅 제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">서브 제목 (선택)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none transition"
                placeholder="보충 설명을 입력하세요"
              />
            </div>
          </>
        )}

        {/* ── 스타일 탭 ── */}
        {activeTab === 'style' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">폰트 선택</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
              >
                {FONTS.map((font) => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">글자 색상</label>
              <ColorSwatches colors={TEXT_COLORS} selected={textColor} onSelect={setTextColor} />
            </div>
            {titleFontSize !== undefined && setTitleFontSize && (
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>제목 크기</span>
                  <span className="tabular-nums text-gray-500">{titleFontSize}px</span>
                </label>
                <input
                  type="range" min="40" max="110" value={titleFontSize}
                  onChange={(e) => setTitleFontSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">텍스트 위치</label>
              <div className="grid grid-cols-3 gap-1 w-fit">
                {(['top', 'middle', 'bottom'] as const).map((v) =>
                  (['left', 'center', 'right'] as const).map((h) => {
                    const isActive = textAlign === h && textVAlign === v;
                    const dotPos = {
                      'top-left': 'items-start justify-start',
                      'top-center': 'items-start justify-center',
                      'top-right': 'items-start justify-end',
                      'middle-left': 'items-center justify-start',
                      'middle-center': 'items-center justify-center',
                      'middle-right': 'items-center justify-end',
                      'bottom-left': 'items-end justify-start',
                      'bottom-center': 'items-end justify-center',
                      'bottom-right': 'items-end justify-end',
                    }[`${v}-${h}`];
                    return (
                      <button
                        key={`${v}-${h}`}
                        type="button"
                        title={`${v === 'top' ? '상단' : v === 'middle' ? '중간' : '하단'} ${h === 'left' ? '왼쪽' : h === 'center' ? '가운데' : '오른쪽'}`}
                        onClick={() => { setTextAlign(h); setTextVAlign(v); }}
                        className={`w-9 h-9 rounded border flex p-1.5 transition ${
                          isActive ? 'bg-[#111111] border-[#111111]' : 'bg-white border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <span className={`flex w-full h-full ${dotPos}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
              <div className="mt-3 space-y-2">
                <div>
                  <label className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>좌우 이동</span>
                    <span className="tabular-nums">{textOffsetX > 0 ? `+${textOffsetX}` : textOffsetX}%</span>
                  </label>
                  <input
                    type="range" min="-40" max="40" value={textOffsetX}
                    onChange={(e) => setTextOffsetX(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>상하 이동</span>
                    <span className="tabular-nums">{textOffsetY > 0 ? `+${textOffsetY}` : textOffsetY}%</span>
                  </label>
                  <input
                    type="range" min="-40" max="40" value={textOffsetY}
                    onChange={(e) => setTextOffsetY(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                  />
                </div>
                {(textOffsetX !== 0 || textOffsetY !== 0) && (
                  <button
                    type="button"
                    onClick={() => { setTextOffsetX(0); setTextOffsetY(0); }}
                    className="text-xs text-gray-400 hover:text-gray-700 transition"
                  >
                    위치 초기화
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── 배경 탭 ── */}
        {activeTab === 'bg' && (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setBgType('color')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${bgType === 'color' ? 'bg-[#111111] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                단색 배경
              </button>
              <button
                onClick={() => setBgType('image')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${bgType === 'image' ? 'bg-[#111111] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                이미지 배경
              </button>
            </div>

            {bgType === 'color' ? (
              <div>
                <label className="block text-sm text-gray-600 mb-2">배경 색상</label>
                <ColorSwatches colors={BG_COLORS} selected={bgColor} onSelect={setBgColor} />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">배경 이미지 업로드</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition relative overflow-hidden">
                  {bgImage ? (
                    <>
                      <img src={bgImage} alt="배경 미리보기" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                      <div className="relative z-10 flex flex-col items-center bg-white/80 p-2 rounded">
                        <ImageIcon className="w-6 h-6 text-gray-500 mb-1" />
                        <span className="text-sm font-medium text-gray-700">이미지 변경</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">클릭하여 이미지 업로드</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
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

            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>어두운 필터</span>
                <span>{overlayOpacity}%</span>
              </label>
              <input
                type="range" min="0" max="100" value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">테두리 프레임</label>
              <select
                value={frameType}
                onChange={(e) => setFrameType(e.target.value as FrameType)}
                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="none">없음</option>
                <option value="band">하단 밴드 (그라데이션)</option>
                <option value="solid">실선 테두리</option>
                <option value="double">이중선 테두리</option>
                <option value="corners">모서리 포인트</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
