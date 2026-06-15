# 검증 보고서

> 작성일 2026-06-13 · 브랜치 `oss-enhancement/2026-06-13`

## 검증 환경 메모

이 프로젝트에는 `package.json`·번들러·lint·typecheck·테스트 프레임워크·CI가 **존재하지 않는다**(순수 정적 HTML). 따라서 일반적 `npm test`/`build`/`tsc`/`eslint`는 **해당 없음(N/A)**. 대신 정적 HTML/JS에 적용 가능한 검증을 수행했다.

## 실행한 검증과 결과

| # | 검증 | 방법 | 결과 |
|---|---|---|---|
| 1 | JS 문법 | 인라인 `<script>` 추출 후 `node --check` | ✅ PASS |
| 2 | HTML 태그 균형 | Python `html.parser`로 전체 파싱, 미닫힘 태그 검사 | ✅ PASS (잔여 0) |
| 3 | 핵심 함수 회귀 가드 | `go/calc/riskCalc/renderC/initCF/initNC/initRpt/switchM/openNC` 정의 존재 확인 | ✅ 전부 OK |
| 4 | 신규 기능 연결 | `printDoc` 버튼 4개·`@media print` 1블록·`FEATURES` 플래그 1개 | ✅ 4 / 1 / 1 |
| 5 | 직전 개선 유지 | img alt 12/12, `loading=lazy` 11, `og:image` 1 | ✅ 유지됨 |

> lint/typecheck/unit/integration/e2e/build = **N/A (도구 부재)**. 도구가 없어 "스킵"이 아니라 "대상 없음"임을 명시한다.

## 회귀 영향 분석

- 변경은 **추가 전용**(append-only): 새 `@media print` CSS 블록, 새 `printDoc()`/`FEATURES`, 버튼 4곳에 `onclick` 속성 추가.
- 기존 함수·이벤트·스타일을 **수정·삭제하지 않음** → 탭 전환·시뮬레이터·차트·투어 등 기존 동작에 영향 없음.
- `@media print`는 인쇄 시에만 적용 → 화면 표시(스크린 미디어)에 영향 없음.

## 수동 테스트 시나리오 (권장)

브라우저에서 `index.html`을 열고 다음을 확인:

1. **성과 리포트** 탭 → "PDF 내보내기" → 인쇄 미리보기에서 ▷ 상단 네비/우하단 투어 버튼/브라우저 크롬 바 숨김, ▷ 리포트 한 탭만 출력, ▷ 카드가 페이지 경계에서 잘리지 않음, ▷ 브랜드 파랑·배경색 유지.
2. **CareFlow OS** "결과보고서 내보내기" / 참여자표 "내보내기" → 현재 화면 인쇄.
3. **NoriCare** "보호자 리포트" → 개인 리포트 화면 인쇄.
4. 인쇄 취소 후 화면이 정상 복귀하는지(스크린 표시 무변).
5. 콘솔에서 `FEATURES.printExport=false` 설정 후 버튼 클릭 → 인쇄 미발생(비활성화 동작).

> 브라우저 인쇄는 환경 의존(헤드리스 자동화 불가)이라 위 항목은 사람이 1회 확인 권장. 차트는 `<canvas>` 래스터로 인쇄되며, 해당 탭을 한 번 연 뒤 인쇄하면 정상 출력된다.

## 기존 실패 / 미해결

- 없음. 본 변경으로 인한 신규 실패 없음.
- 알려진 한계(범위 외): 외부 CDN 의존(오프라인 발표 리스크), 키보드 접근성, 하드코딩 날짜 — `innovation-opportunities.md`에 후속 항목으로 정리됨.

## 결론 (사이클 1)

추가 전용 변경으로 **회귀 위험 낮음**, 모든 정적 검증 통과. 인쇄/PDF 기능은 의존성·라이선스 리스크 없이 동작하며 기능 플래그로 비활성화 가능.

---

## 사이클 2 검증 — 접근성 + 공유 링크

| # | 검증 | 결과 |
|---|---|---|
| 1 | JS 문법 `node --check` | ✅ PASS |
| 2 | HTML 태그 균형 | ✅ PASS (미닫힘 0) |
| 3 | 신규 요소 | role tablist/tab 1, aria-selected 1, prefers-reduced-motion 2, :focus-visible 2, shareCalc 2, applyCalcParams 2, tr onkeydown 1 → ✅ |
| 4 | 핵심 함수 회귀 가드 | `go/calc/shareCalc/applyCalcParams/countUp/renderC/printDoc/viewFromHash/curTab` → ✅ 전부 OK |

### 라우팅 로직 점검(수동 추론)
- 공유 링크 `#ask?gu=20&pp=500&cy=6` 진입 → `viewFromHash()`가 `ask` 반환 → `applyCalcParams()`가 `location.hash`에서 20/500/6 복원 → `calc()`가 동일 쿼리로 `replaceState`. ✅
- 일반 클릭 `go('ask')` → 쿼리 없음 → 슬라이더 유지, `calc()`가 현재값으로 URL 직렬화. ✅
- `replaceState`는 `hashchange`를 발생시키지 않음 → **무한 루프 없음**. ✅
- 투어 버튼/방향키가 쓰는 `curTab()`도 쿼리 분리하도록 수정 → ask 페이지(+쿼리)에서 투어 라벨/방향키 정상. ✅ (회귀 방지)

### 수동 테스트 시나리오 (권장)
1. **협업 제안** 탭 → 슬라이더 조정 → URL이 `#ask?gu=..&pp=..&cy=..`로 갱신되는지.
2. "시나리오 링크 복사" → 클립보드 복사(또는 prompt 폴백), 버튼이 "링크 복사됨 ✓"로 1.5초 표시.
3. 복사한 링크를 새 탭에 붙여넣기 → 슬라이더·결과 수치가 복원되는지.
4. **키보드만으로**: Tab으로 상단 탭 이동 → Enter/Space로 탭 전환(포커스 링 보임). 참여자 표 행에 Tab 포커스 → Enter로 상세 진입.
5. OS "동작 줄이기(Reduce Motion)" 켠 상태 → 카운트업이 즉시 최종값, 펄스/전환 멈춤.

### 회귀 영향
- 사이클 2도 **추가 전용**(라우팅은 쿼리 분리만 추가, 기존 경로 동작 보존). 기존 탭/차트/시뮬레이터/투어 동작 유지.

## 사이클 2 종합
사이클 1·2 모두 정적 검증 통과, 새 의존성·서버 변경 0, 외부 OSS 코드 복사 0. 회귀 위험 낮음.

---

## 사이클 3 검증 — 오프라인 복원력 · 발표자 모드 · 데이터 레이어

| # | 검증 | 결과 |
|---|---|---|
| 1 | JS 문법 `node --check` | ✅ PASS |
| 2 | HTML 태그 균형 | ✅ PASS (미닫힘 0) |
| 3 | `bash -n vendor/fetch-assets.sh` | ✅ PASS |
| 4 | `ensureChart` 적용 | 정의1+호출3 = 4 → ✅ |
| 5 | 폰트 폴백(Apple SD Gothic Neo 등) | ✅ 적용 |
| 6 | `toggleFullscreen` 연결 | 정의1+키1+버튼1 = 3 → ✅ |
| 7 | 데이터 분리 `perfChart`/`aggChart` | 각 정의1+사용3 = 4 → ✅, 인라인 리터럴 잔존 0(정의만 2) |

### 환경 제약 (정직 보고)
- **오프라인 자산 번들은 이 샌드박스에서 실행 불가**: CDN(`cdnjs`, `jsdelivr`)이 **HTTP 403**으로 차단됨. 따라서 `vendor/fetch-assets.sh`는 **작성·문법검사만** 했고 실제 다운로드/치환은 **검증하지 못함**(네트워크 가능 환경에서 사용자 실행 필요). 대신 다운로드 없이 동작하는 폰트 폴백·차트 graceful degradation은 코드로 검증함.

### 수동 테스트 시나리오 (권장)
1. 네트워크 차단 상태로 열기 → 한글이 시스템 폰트로 정상 표시, CareFlow/리포트 탭에서 차트 자리에 안내 문구(페이지 비충돌).
2. `F` 키 또는 nav "발표 모드" → 전체화면 진입, 버튼 라벨 "나가기"로 바뀌고 DEMO/PoC 배지 숨김. 다시 F → 복귀.
3. 입력 슬라이더에 포커스한 채 F → 전체화면 토글 안 됨(입력 보호).
4. CareFlow/리포트 차트가 기존과 동일하게 렌더(데이터 분리 후 회귀 없음).

---

## 사이클 4 검증 — 동적 날짜

하드코딩 날짜(D-카운터·리포트 생성일·앱 홈 날짜)를 **오늘 기준 계산**으로 전환. PoC 시작 앵커(2026-07-20)는 고정.

| 검증 | 결과 |
|---|---|
| JS 문법 `node --check` | ✅ PASS |
| HTML 태그 균형 | ✅ PASS (미닫힘 0) |
| `data-dday`/`data-today-dot`/`data-today-k` 연결 | 각 마크업1+JS1 → ✅ |
| 오늘(2026-06-13, 토) 기준 계산 시뮬레이션 | `PoC D-37` / `2026.06.13` / `2026년 6월 13일 · 토` → ✅ 일치 |

- JS 비활성 시 정적 텍스트(예: "PoC D-38")가 폴백으로 표시됨(접근성·견고성).
- D-day 분기: 시작 전 `PoC D-N`, 당일 `PoC D-DAY`, 이후 `PoC 진행중`.

## 종합 결론
사이클 1–4 정적 검증 전부 통과.

---

## 사이클 5 — 코드 리뷰 & 버그 수정

전체 브랜치 diff(`main...HEAD`)를 대상으로 라인-바이-라인 correctness + 제거동작/교차파일 + 클린업 앵글로 리뷰. **실제 버그 2건 발견·수정.**

### 🐞 BUG 1 (치명적) — 딥링크 시 TDZ ReferenceError
- **증상**: `#cf`/`#nc`/`#rpt`로 **첫 로드** 시 페이지 JS 전체가 죽음.
- **원인**: 부트스트랩 즉시 호출 `if(location.hash)go(viewFromHash())`가 스크립트 상단에 있어, `go`→`initCF/initNC/initRpt`가 참조하는 하단 `const`(P·perfChart·mdata·aggChart)가 **TDZ(임시 사각지대)** 상태 → `ReferenceError: Cannot access 'P' before initialization`. 예외가 부트스트랩에서 전파되어 이후 모든 초기화(투어 버튼·키보드·발표 모드·동적 날짜)가 미실행.
- **영향 확대**: 사이클 1·2의 SEO 공유·시나리오 공유 링크로 딥링크 진입 가능성↑ → 잠복 버그가 표면화.
- **수정**: 최초 딥링크 내비게이션 호출을 **스크립트 맨 끝**(모든 const·차트 init·`go` 래퍼 정의 후)으로 이동. `node` 구조 재현으로 수정 전 예외 / 수정 후 정상 확인.

### 🐞 BUG 2 (브라우저 호환) — 풀스크린 promise 미가드
- **증상**: 구형 Safari(webkit 접두 API)에서 `F`/발표 모드 클릭 시 `TypeError: ...catch is not a function`.
- **원인**: `webkitRequestFullscreen()`/`webkitExitFullscreen()`은 Promise가 아닌 `undefined`를 반환할 수 있는데 `.catch()`를 바로 호출.
- **수정**: 반환값 가드 — `const p=req.call(el); if(p&&p.catch)p.catch(()=>{});`.

### 리뷰에서 REFUTED된 후보(기록)
- 딥링크 시 슬라이더 미렌더 → applyCalcParams 실패: **반증**(인라인 스크립트가 `</body>` 직전, 모든 뷰 마크업[슬라이더 L1460]이 스크립트[L1535]보다 앞 → DOM 준비 완료).
- shareCalc의 replaceState 레이스: **반증**(replaceState는 동기 API).
- ensureChart 교체 후 getContext 호출: **반증**(`if(!ensureChart())return;`이 getContext보다 먼저, 교체는 미로딩 경로에서만).
- openNC 동명이인 오작동: **반증**(`clients.indexOf(c)`는 객체 참조 비교).
- 클린업 6건(메타 DRY·해시 파서 통합·풀스크린 상태 헬퍼 등): 버그 아님, 우선순위 낮음으로 보류.

### 검증
- JS `node --check` PASS · HTML 태그 균형 PASS · TDZ 구조 재현(수정 후 정상) · 풀스크린 가드 적용 확인.

---

## 사이클 6 — 자동 회귀 테스트 하니스 + 프로젝트 문서

BUG 1(TDZ)이 수동 검증을 빠져나간 점을 보완하기 위해 **재실행 가능한 검증 도구**를 도입.

### 추가물
- `scripts/smoke-test.mjs` — 의존성 0의 헤드리스 스모크 테스트. 인라인 `<script>`를 추출해 최소 DOM 셰임 위 `node:vm`에서 **각 탭(딥링크 포함)으로 신선 로드**를 실행, 예외 없음을 검증. 대상 해시: `''`,`#home`,`#cf`,`#nc`,`#rpt`,`#ask`,`#ask?gu=20&pp=500&cy=6`,`#bogus`.
- `scripts/check.sh` — JS 문법 + HTML 균형 + 스모크 테스트 일괄.
- `.gitignore` — `index.html.bak`/`*.tmp`(번들 스크립트 산출물) 등.
- `README.md` — stub(1줄) → 실행/구성/기능/단축키/커스터마이즈/검증/오프라인/문서 종합.

### 테스트의 유효성(teeth) 검증
- 현재(수정된) 코드: 8/8 무예외 → ✅ 통과.
- **버그 재현본**(딥링크 호출을 const 정의 전으로 되돌림)에 대해 실행 → `ReferenceError: Cannot access 'clients' before initialization` **검출** → 테스트가 TDZ 회귀를 실제로 잡음을 확인(무력한 테스트 아님).

### 검증
- `bash scripts/check.sh` → 3/3 PASS (JS 문법 · HTML 균형 · 스모크 8/8). **새 런타임 의존성 0, 외부 OSS 코드 복사 0**(번들 스크립트는 사용자가 선택 실행). 변경은 모두 추가/치환 전용으로 회귀 위험 낮음. 인쇄·클립보드·전체화면·오프라인 폰트·reduced-motion·실제 자산 번들은 환경 의존이라 사람이 1회 수동 확인 권장.
