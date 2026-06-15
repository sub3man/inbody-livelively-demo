#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# 오프라인 발표용 자산 번들링 스크립트
#
# Chart.js와 Pretendard 웹폰트를 이 vendor/ 폴더로 내려받고,
# index.html을 로컬 경로를 쓰도록 전환합니다. (백업: index.html.bak)
#
# ⚠️ 본 스크립트는 외부 네트워크가 차단된 빌드 샌드박스에서는 실행 검증되지
#    않았습니다(CDN 403). 인터넷이 되는 환경에서 저장소 루트 기준으로 실행하세요:
#       bash vendor/fetch-assets.sh
#
# 라이선스: Chart.js = MIT, Pretendard = SIL Open Font License 1.1
#          (둘 다 상업적 사용 가능 · 본 스크립트가 라이선스 파일도 함께 받음)
# ─────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VEN="$ROOT/vendor"
PRE="$VEN/pretendard"
mkdir -p "$PRE/woff2"

CHART_VER="4.4.0"
PRE_VER="1.3.9"
CHART_URL="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/${CHART_VER}/chart.umd.min.js"
PRE_BASE="https://cdn.jsdelivr.net/npm/pretendard@${PRE_VER}/dist/web/variable"
CSS_URL="${PRE_BASE}/pretendardvariable.min.css"

echo "▶ Chart.js ${CHART_VER} 내려받는 중…"
curl -fsSL "$CHART_URL" -o "$VEN/chart.umd.min.js"

echo "▶ Pretendard ${PRE_VER} CSS 내려받는 중…"
curl -fsSL "$CSS_URL" -o "$PRE/pretendardvariable.min.css"

echo "▶ CSS가 참조하는 폰트 파일 추출·내려받는 중…"
# url(...) 항목을 뽑아 상대경로를 CSS_BASE 기준으로 해석해 동일 구조로 저장
grep -oE "url\(([^)]+)\)" "$PRE/pretendardvariable.min.css" \
  | sed -E "s/url\(['\"]?([^'\")]+)['\"]?\)/\1/" \
  | sort -u \
  | while read -r ref; do
      # 데이터 URI는 건너뜀
      case "$ref" in data:*) continue;; esac
      rel="${ref#./}"
      mkdir -p "$PRE/$(dirname "$rel")"
      echo "   · $rel"
      curl -fsSL "${PRE_BASE}/${rel}" -o "$PRE/$rel" || echo "     (건너뜀: ${rel})"
    done

echo "▶ 라이선스 파일 내려받는 중…"
curl -fsSL "https://raw.githubusercontent.com/chartjs/Chart.js/master/LICENSE.md" -o "$VEN/Chart.js-LICENSE.md" || true
curl -fsSL "https://raw.githubusercontent.com/orioncactus/pretendard/main/LICENSE" -o "$PRE/Pretendard-LICENSE" || true

echo "▶ index.html을 로컬 경로로 전환(백업 index.html.bak 생성)…"
cp "$ROOT/index.html" "$ROOT/index.html.bak"
# CSS link 교체
sed -i.tmp \
  -e "s#https://cdn.jsdelivr.net/npm/pretendard@${PRE_VER}/dist/web/variable/pretendardvariable.min.css#vendor/pretendard/pretendardvariable.min.css#g" \
  -e "s#https://cdnjs.cloudflare.com/ajax/libs/Chart.js/${CHART_VER}/chart.umd.min.js#vendor/chart.umd.min.js#g" \
  "$ROOT/index.html"
rm -f "$ROOT/index.html.tmp"

echo "✅ 완료. 이제 인터넷 없이도 폰트·차트가 동작합니다."
echo "   되돌리려면: mv index.html.bak index.html"
