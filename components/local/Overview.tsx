'use client';
import { fileUrl, ui, type Post } from './api';
import { RemotionStill } from './RemotionStill';
import type { CardsData } from './CardsSection';
import type { ScenesData } from './ScenesSection';

export const select = (section: string, id: string | number) => {
  window.dispatchEvent(new CustomEvent('local-select', { detail: { section, id } }));
  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// 검수판: 썸네일 + 카드 전부 + 씬 전부를 Player 정지 프레임으로 한 줄에. 클릭하면 해당 섹션에서 선택.
export function Overview({ info, cards, scenes }: { post: string; info: Post | null; cards: CardsData | null; scenes: ScenesData | null }) {
  const W = 118;
  return (
    <div className={ui.card}>
      <div className="flex items-baseline gap-3"><div className={ui.h}>검수판</div><span className={ui.sub}>클릭하면 그 항목으로 이동해요. 빨강 = 사진 없음, 노랑 = 자막 길이 주의</span></div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        <Item label="썸네일" onClick={() => select('thumb', 0)}>
          {info?.thumb ? <img src={fileUrl(info.thumb, info.mtime)} alt="" style={{ width: W, height: W }} className="rounded-lg object-cover" /> : <Empty w={W} h={W} text="없음" />}
        </Item>
        {cards?.cards.map((c) => (
          <Item key={c.id} label={c.id} warn={!c.imageUrl ? 'red' : undefined} onClick={() => select('cards', c.id)}>
            {c.imageUrl ? <RemotionStill kind="card" inputProps={c} width={W} /> : <Empty w={W} h={W} text="사진 없음" />}
          </Item>
        ))}
        {scenes?.scenes.map((s, i) => {
          const long = (s.type ?? 'caption') === 'caption' && (s.text || '').length > 24;
          return (
            <Item key={i} label={`씬 ${i + 1}`} warn={!s.imageUrl && s.type !== 'infoCard' ? 'red' : long ? 'amber' : undefined} onClick={() => select('scenes', i)}>
              {s.type === 'infoCard' ? <Empty w={66} h={W} text="정보" /> : !s.imageUrl ? <Empty w={66} h={W} text="없음" />
                : <RemotionStill kind={s.type === 'cover' ? 'cover' : 'scene'} inputProps={s.type === 'cover' ? { ...s, variant: 'topRow' } : s} width={66} />}
            </Item>
          );
        })}
      </div>
    </div>
  );
}
const Item = ({ label, warn, onClick, children }: { label: string; warn?: 'red' | 'amber'; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`shrink-0 rounded-xl p-1 text-left ${warn === 'red' ? 'ring-2 ring-red-400' : warn === 'amber' ? 'ring-2 ring-amber-400' : 'hover:ring-2 hover:ring-gray-200'}`}>
    {children}<div className="mt-1 max-w-[118px] truncate text-[11px] text-gray-500">{label}</div>
  </button>
);
const Empty = ({ w, h, text }: { w: number; h: number; text: string }) => <div style={{ width: w, height: h }} className="flex items-center justify-center rounded-lg bg-gray-100 text-[11px] text-gray-400">{text}</div>;
