'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/blog', label: '블로그 가이드' },
  { href: '/', label: '썸네일 만들기' },
  { href: '/skin-maker', label: '스킨메이커' },
  { href: '/guide/thumbnail', label: '썸네일 팁' },
  { href: '/about', label: 'About' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-white/10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 text-white font-bold text-sm select-none cursor-pointer">
          <Sparkles className="w-4 h-4 text-white/60" />
          BlogKit
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                isActive(link.href)
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="메뉴 열기"
          aria-expanded={open}
          className="md:hidden p-2 -mr-2 text-white/80 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {open && (
        <nav className="md:hidden max-w-6xl mx-auto flex flex-col gap-1 pb-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                isActive(link.href)
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
