import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

export default [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'components/local/remotion/**'], // remotion/은 naver-blog-auto 원본 복사본(scripts/sync-clip.sh)
  },
];
