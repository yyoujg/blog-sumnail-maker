import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="bg-[#111111] px-4 md:px-8 py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm select-none">
          <Sparkles className="w-4 h-4 text-white/40" />
          BlogKit
        </div>
        <nav className="flex items-center gap-5 text-xs text-white/40">
          <Link href="/blog" className="hover:text-white transition-colors">블로그</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
          <Link href="/contact" className="hover:text-white transition-colors">문의</Link>
        </nav>
        <p className="text-xs text-white/20">© {new Date().getFullYear()} BlogKit</p>
      </div>
    </footer>
  );
}
