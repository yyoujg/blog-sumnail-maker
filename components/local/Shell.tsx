'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bell, LayoutDashboard, FileText, Image as ImageIcon, LayoutGrid, Clapperboard, Landmark, Images } from 'lucide-react';
import { useJobs } from './api';

export const RAIL = [
  { id: 'overview', label: '검수판', icon: LayoutDashboard },
  { id: 'thumb', label: '썸네일', icon: ImageIcon },
  { id: 'cards', label: '카드', icon: LayoutGrid },
  { id: 'scenes', label: '씬', icon: Clapperboard },
  { id: 'finance', label: '금융', icon: Landmark },
  { id: 'media', label: '미디어', icon: Images },
];
const NAV = [['/local', '작업판'], ['/local?tab=drafts', '작업중 글'], ['/local?tab=published', '발행 글'], ['/local/finance', '금융 썸네일']] as const;

export function Shell({ children, right, inWorkspace }: { children: React.ReactNode; right?: React.ReactNode; inWorkspace?: boolean }) {
  const path = usePathname();
  const jobs = useJobs();
  const running = jobs.filter((j) => j.status === 'running').length;
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-800">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-8 border-b border-gray-100 bg-white px-6">
        <Link href="/local" className="flex items-center gap-1 text-lg font-extrabold tracking-tight text-gray-900">
          로컬 편집기 <span className="rounded-md bg-[#19C79A] px-1.5 text-xs text-white">C</span>
        </Link>
        <nav className="flex gap-6 text-[14px] font-semibold text-gray-700">
          {NAV.map(([href, label]) => <Link key={href} href={href} className={path === href.split('?')[0] && !href.includes('?') ? 'text-gray-900' : 'hover:text-gray-900'}>{label}</Link>)}
        </nav>
        <div className="ml-auto relative">
          <button className="relative rounded-full p-2 hover:bg-gray-100" onClick={() => setOpen((o) => !o)} title="렌더 큐">
            <Bell size={18} />
            {running > 0 && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-[#19C79A] px-1 text-[10px] font-bold text-white">{running}</span>}
          </button>
          {open && (
            <div className="absolute right-0 mt-1 w-80 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
              <div className="mb-2 text-xs font-bold text-gray-500">렌더 큐</div>
              {jobs.length === 0 && <div className="text-xs text-gray-400">아직 없어요</div>}
              {jobs.slice(0, 8).map((j) => (
                <div key={j.id} className="border-t border-gray-50 py-1.5 text-xs">
                  <span className={j.status === 'running' ? 'text-[#19C79A]' : j.status === 'error' ? 'text-red-500' : 'text-gray-400'}>●</span> {j.label}
                  <div className="truncate text-[11px] text-gray-400">{j.post.split('/').pop()}{j.status === 'error' ? ` · ${j.log.split('\n').pop()}` : ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className="mx-auto flex max-w-[1400px] gap-5 px-5 py-5">
        <aside className="hidden w-[76px] shrink-0 flex-col items-center gap-1 rounded-2xl bg-white py-3 md:flex">
          {RAIL.map(({ id, label, icon: Icon }) => (
            <a key={id} href={inWorkspace ? `#${id}` : id === 'finance' ? '/local/finance' : '/local'} className="flex w-full flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <span className="rounded-lg bg-gray-50 p-1.5"><Icon size={18} /></span>{label}
            </a>
          ))}
        </aside>
        <main className="min-w-0 flex-1 space-y-5">{children}</main>
        {right && <aside className="hidden w-[320px] shrink-0 space-y-5 lg:block">{right}</aside>}
      </div>
    </div>
  );
}
