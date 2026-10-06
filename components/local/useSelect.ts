'use client';
import { useEffect } from 'react';
// Overview에서 항목을 클릭하면 해당 섹션이 그 항목을 선택하도록 하는 작은 이벤트 버스.
export function useSelect(section: string, onSelect: (id: string | number) => void) {
  useEffect(() => {
    const h = (e: Event) => { const d = (e as CustomEvent).detail; if (d?.section === section) onSelect(d.id); };
    window.addEventListener('local-select', h); return () => window.removeEventListener('local-select', h);
  }, [section, onSelect]);
}
