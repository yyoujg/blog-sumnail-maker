'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function SiteHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/blog', label: '블로그 가이드' },
    { href: '/guide/thumbnail', label: '썸네일 팁' },
    { href: '/', label: '썸네일 만들기' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-white/10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-sm select-none cursor-pointer">
          <Sparkles className="w-4 h-4 text-white/60" />
          BlogKit
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
