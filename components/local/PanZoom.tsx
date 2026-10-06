'use client';
import { useRef } from 'react';
// 캔버스 위 드래그 = objectPosition(%), ⌘/Ctrl+휠 = zoom. Player 위에 투명 오버레이를 얹어 포인터를 가로챈다(Player 내부가 이벤트를 먹지 않게).
// ponytail: cover 크롭 비율 무시한 1:1 휴리스틱, 어긋나면 이미지 비율 반영.
export function PanZoom({ position, zoom, width, onChange, children, disabled }: {
  position: string; zoom: number; width: number; onChange: (p: { position: string; zoom: number }) => void; children: React.ReactNode; disabled?: boolean;
}) {
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const parse = () => { const m = position.match(/([\d.]+)%\s+([\d.]+)%/); return m ? [Number(m[1]), Number(m[2])] : [50, 50]; };
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  return (
    <div className="relative select-none" style={{ width }}>
      {children}
      {!disabled && (
        <div className="absolute inset-0 cursor-grab active:cursor-grabbing" style={{ touchAction: 'none' }}
          onPointerDown={(e) => { const [px, py] = parse(); drag.current = { x: e.clientX, y: e.clientY, px, py }; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { if (!drag.current) return; const d = drag.current; const k = 100 / width; onChange({ position: `${clamp(d.px - (e.clientX - d.x) * k)}% ${clamp(d.py - (e.clientY - d.y) * k)}%`, zoom }); }}
          onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
          onWheel={(e) => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); onChange({ position, zoom: Math.max(1, Math.min(3, Math.round((zoom + (e.deltaY < 0 ? 0.05 : -0.05)) * 100) / 100)) }); }}>
          <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">드래그 = 위치 · ⌘/Ctrl+휠 = 확대 {zoom.toFixed(2)}x</div>
        </div>
      )}
    </div>
  );
}
