#!/bin/sh
# naver-blog-auto의 Remotion 컴포넌트를 로컬 편집기용으로 복사한다(브라우저 Player에서 같은 코드로 미리보기).
# 원본이 바뀌면 다시 실행: npm run sync:clip
set -e
SRC="${BLOG_AUTO_ROOT:-/Users/dev/naver-blog-auto}/clip-pipeline/remotion/src"
DST="$(dirname "$0")/../components/local/remotion"
# 원본은 Remotion CLI(SWC)로만 빌드돼 tsc를 안 탄다 → 여기서는 타입 검사만 끈다(런타임 동일).
for f in PostCard Thumbnail Scene InfoCard CaptionVideo; do { echo "// @ts-nocheck -- scripts/sync-clip.sh 가 복사한 원본. 직접 고치지 말 것."; cat "$SRC/$f.tsx"; } > "$DST/$f.tsx"; done
echo "synced from $SRC"
