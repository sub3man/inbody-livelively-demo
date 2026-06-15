#!/usr/bin/env bash
# 정적 데모 검증 일괄 실행 (의존성 없음)
#   bash scripts/check.sh
# 1) 인라인 JS 문법  2) HTML 태그 균형  3) 헤드리스 스모크 테스트(탭/딥링크 무예외)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
fail=0

echo "▶ [1/3] 인라인 JS 문법 (node --check)"
awk '/^<script>$/{f=1;next} /^<\/script>$/{f=0} f' index.html > /tmp/_app.js
if node --check /tmp/_app.js; then echo "   ✓ PASS"; else echo "   ✗ FAIL"; fail=1; fi

echo "▶ [2/3] HTML 태그 균형"
python3 - <<'PY' || fail=1
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s): super().__init__(); s.stack=[]; s.void={'meta','link','img','br','hr','input','source','area','base','col','embed','param','track','wbr'}
    def handle_starttag(s,t,a):
        if t not in s.void: s.stack.append(t)
    def handle_endtag(s,t):
        if t in s.void: return
        if s.stack and s.stack[-1]==t: s.stack.pop()
        elif t in s.stack:
            while s.stack and s.stack.pop()!=t: pass
p=P(); p.feed(open('index.html',encoding='utf-8').read())
import sys
if p.stack: print('   ✗ FAIL 미닫힘:', p.stack); sys.exit(1)
print('   ✓ PASS (미닫힘 0)')
PY

echo "▶ [3/3] 헤드리스 스모크 테스트"
if node scripts/smoke-test.mjs; then :; else fail=1; fi

echo
if [ "$fail" -eq 0 ]; then echo "✅ 전체 통과"; else echo "❌ 실패 항목 있음"; exit 1; fi
