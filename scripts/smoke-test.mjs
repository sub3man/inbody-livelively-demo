// ─────────────────────────────────────────────────────────────
// 헤드리스 스모크 테스트 (의존성 없음 · node로 실행)
//
//   node scripts/smoke-test.mjs
//
// index.html의 인라인 스크립트를 추출해, 각 탭으로 "신선하게 로드"되는
// 상황(딥링크 포함)을 최소 DOM 셰임 위에서 실행하고 예외가 없는지 검증한다.
// → #cf/#nc/#rpt 딥링크 시 발생했던 TDZ ReferenceError 같은 회귀를 자동 차단.
// ─────────────────────────────────────────────────────────────
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

// 마지막 <script>...</script>(인라인 앱 스크립트) 추출
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const appSrc = scripts[scripts.length - 1];
if (!appSrc || appSrc.length < 500) { console.error('✗ 인라인 스크립트를 추출하지 못했습니다.'); process.exit(2); }

// — 최소 DOM 셰임 팩토리 —
function makeEl() {
  const el = {
    style: {}, dataset: {}, value: '', textContent: '', innerHTML: '',
    classList: { add(){}, remove(){}, contains(){ return false; }, toggle(){} },
    setAttribute(){}, getAttribute(){ return null; }, addEventListener(){},
    appendChild(){}, replaceWith(){}, getContext(){ return {}; },
    querySelectorAll(){ return []; }, focus(){}, onclick: null,
  };
  return el;
}
function nodeList(n) { return Array.from({ length: n }, makeEl); }

function buildSandbox(hash) {
  const location = { hash, origin: 'http://localhost', pathname: '/index.html' };
  const sandbox = {
    console,
    location,
    history: { replaceState(_s, _t, url) { if (typeof url === 'string') location.hash = url; } },
    performance: { now: () => Date.now() },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    // reduced-motion = true → countUp이 애니메이션 없이 즉시 종료(rAF 재귀 방지)
    matchMedia: () => ({ matches: true, addEventListener(){}, addListener(){} }),
    requestAnimationFrame: () => 0,
    setTimeout: (cb) => { try { cb && cb(); } catch {} return 0; },
    URLSearchParams,
    prompt: () => '',
    // Chart.js 스텁
    Chart: function (ctx, cfg) { return { data: cfg && cfg.data, options: cfg && cfg.options, update(){} }; },
    document: {
      getElementById: () => makeEl(),
      // 어떤 선택자든 5개 요소 반환 → tabs[map[id]] 인덱싱·forEach 안전
      querySelectorAll: () => nodeList(5),
      querySelector: () => makeEl(),
      createElement: () => makeEl(),
      addEventListener(){},
      body: { appendChild(){}, classList: { add(){}, remove(){}, contains(){ return false; }, toggle(){} } },
      fullscreenElement: null, webkitFullscreenElement: null,
    },
    // window.* 호출 지원
    addEventListener(){}, print(){}, scrollTo(){},
  };
  sandbox.window = sandbox; // 스크립트의 window.* === 전역
  return sandbox;
}

const HASHES = ['', '#home', '#cf', '#nc', '#rpt', '#ask', '#ask?gu=20&pp=500&cy=6', '#bogus'];
let failed = 0;
for (const hash of HASHES) {
  const sandbox = buildSandbox(hash);
  vm.createContext(sandbox);
  try {
    vm.runInContext(appSrc, sandbox, { timeout: 5000 });
    console.log(`  ✓ load "${hash || '(no hash)'}" — 예외 없음`);
  } catch (e) {
    failed++;
    console.error(`  ✗ load "${hash || '(no hash)'}" — ${e.constructor.name}: ${e.message}`);
  }
}

if (failed) { console.error(`\n✗ 스모크 테스트 실패: ${failed}/${HASHES.length}`); process.exit(1); }
console.log(`\n✓ 스모크 테스트 통과: ${HASHES.length}/${HASHES.length} (모든 탭/딥링크 로드 무예외)`);
