export type TextAlign = 'left' | 'center' | 'right';
export type TextVAlign = 'top' | 'middle' | 'bottom';
export type FrameType = 'none' | 'solid' | 'double' | 'corners' | 'band';
export type BgType = 'color' | 'image';
export type SubtitlePosition = 'above' | 'below';

export interface FontOption {
  name: string;
  value: string;
}

export interface StylePreset {
  id: string;
  label: string;
  imageAlt: string;
  emoji: string;
  bgType: BgType;
  bgColor: string;
  bgImage: string;
  textColor: string;
  fontFamily: string;
  frameType: FrameType;
  overlayOpacity: number;
  textAlign: TextAlign;
  textVAlign: TextVAlign;
  title: string;
  subtitle: string;
  category: string;
  categoryOptions: readonly string[];
  textShadow: boolean;
  // 옵셔널 확장 (미지정 시 기본 렌더)
  accentColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  titleHighlightColor?: string;
  subtitlePosition?: SubtitlePosition;
  subtitleFontFamily?: string;
  subtitleColor?: string;
  titleFontSize?: number;
}
