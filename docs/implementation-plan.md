# 실행 계획

> 작성일 2026-06-13 · 브랜치 `oss-enhancement/2026-06-13`

## 선택한 개선안

우선순위 기준(적합성·구현가능성·사용자가치·차별화·기술/라이선스 리스크·유지보수비용·빠른 검증)에 따라 **가장 임팩트가 크고 리스크가 낮은 1건**을 이번 사이클에 구현한다.

> **개선안 #1 — 인쇄/PDF 산출물 내보내기 (죽은 export 버튼 활성화)**

근거: ① 이미 존재하는 4개 export 버튼이 무동작이라 피치 신뢰를 직접 해침 → 완성 시 즉각 체감, ② 새 의존성/서버/DB 변경 없음 → 회귀·라이선스 리스크 최소, ③ 제안서는 결국 PDF로 공유되므로 비즈니스 가치 명확, ④ `window.print()` + `@media print`로 빠른 검증 가능.

(나머지 #2~#6은 `innovation-opportunities.md`의 우선순위 표에 따라 후속 사이클로 분리.)

---

## 개선안 #1 상세

### 목표
화면에 보이는 현재 탭을 **그대로 인쇄/PDF**로 저장할 수 있게 하고, 인쇄 시 화면 전용 UI(내비·플로팅 버튼·브라우저 목업 크롬)를 정리해 제안 문서 품질을 확보한다.

### 사용자 시나리오
1. 발표자가 "성과 리포트" 탭에서 **PDF 내보내기** 클릭 → 브라우저 인쇄 대화상자 → "PDF로 저장" → 리포트 한 부 완성.
2. "CareFlow OS" 탭 **결과보고서 내보내기**, 참여자 표 **내보내기**, NoriCare **보호자 리포트**도 동일하게 현재 화면을 인쇄.

### 화면 / UX 변화
- 버튼 4종이 실제 동작(클릭 → 인쇄 대화상자).
- 인쇄 결과물: 상단 네비/플로팅 투어 버튼/브라우저 크롬 바/라이브 점 제거, 현재 탭만 풀폭 출력, 카드가 페이지 경계에서 잘리지 않음, 브랜드 색·배경 유지.

### 필요한 API / DB
- **없음**(클라이언트 전용, 서버·DB 변경 0).

### 필요한 컴포넌트 / 로직
- CSS: `@media print { … }` 블록 1개(기존 `<style>` 말미에 추가).
- JS: `FEATURES.printExport` 플래그 + `printDoc()` 함수(기존 인라인 `<script>`에 추가).
- 마크업: export 버튼 4곳에 `onclick="printDoc()"` 부여.

### 필요한 테스트
- 자동: JS 문법 검사(`node --check`), HTML 태그 균형 파싱(Python `html.parser`).
- 수동: 각 탭에서 인쇄 미리보기 확인(네비/플로팅 버튼 숨김, 현재 탭만 출력, 카드 분할 없음).

### 예상 파일 변경 범위
- `index.html` 단일 파일만 수정(스타일 1블록 + 함수 1개 + 버튼 4곳 속성).
- 신규: `docs/*.md` 6종(문서).

### 롤백 방법
- `index.html`의 `@media print` 블록·`printDoc`/`FEATURES` 정의·버튼 `onclick="printDoc()"` 제거, 또는 `git revert <commit>`.
- 런타임 비활성화: `FEATURES.printExport = false` → 버튼이 인쇄를 트리거하지 않음.

### 완료 기준 (DoD)
- [x] 4개 export 버튼에 `printDoc()` 연결.
- [x] `@media print`로 화면 전용 UI 숨김 + 현재 탭만 출력 + `break-inside:avoid` + 색상 유지.
- [x] 기능 플래그로 비활성화 가능.
- [x] JS 문법·HTML 구조 검증 통과.
- [x] 기존 기능(탭 전환·시뮬레이터·차트·투어) 회귀 없음(추가 전용 변경).
- [x] 변경/검증 문서화(`verification-report.md`, `open-source-attribution.md`).

---

## 사이클 2 — 접근성 + 시뮬레이터 공유 링크 (구현 완료)

`innovation-opportunities.md`의 IDEA 5(접근성)·IDEA 2(공유 링크)를 저리스크 추가 전용 변경으로 구현.

### 개선안 #5 — 접근성 / 모션 배려
- **목표**: 키보드·스크린리더·모션 민감 사용자 포용(공공 B2G 맥락의 신뢰 신호).
- **구현**:
  - 상단 탭(`.ntab`): JS로 `role="tab"`/`tabindex="0"`/Enter·Space 키 핸들러 부여, 컨테이너 `role="tablist"`, `go()`에서 `aria-selected` 동기화.
  - 참여자 표 행: `tabindex="0"`/`role="button"`/`aria-label`/Enter·Space 키 핸들러.
  - `:focus-visible` 포커스 링(탭·행·칩·버튼).
  - `@media (prefers-reduced-motion: reduce)`로 CSS 애니메이션/전환 차단 + JS `countUp()`는 최종값 즉시 표시.
- **롤백**: 해당 JS/CSS 블록·속성 제거 또는 `git revert`.
- **DoD**: [x] 키보드로 탭·행 활성화, [x] 포커스 가시화, [x] reduced-motion 동작, [x] 회귀 없음.

### 개선안 #2 — 시뮬레이터 시나리오 공유 링크
- **목표**: 임팩트 시뮬레이터 값을 URL로 직렬화/복원해 "이 설정으로 보세요" 링크 공유.
- **구현**:
  - 해시 쿼리 라우팅: `#ask?gu=20&pp=500&cy=6`. `viewFromHash()`로 뷰 id에서 쿼리 분리, `go()`가 쿼리 허용.
  - `calc()`가 현재 값을 `replaceState`로 해시에 직렬화. `applyCalcParams()`가 공유 링크 진입 시 슬라이더 복원(range가 min/max 자동 보정).
  - "시나리오 링크 복사" 버튼(`shareCalc()`) → `navigator.clipboard`(미지원 시 `prompt` 폴백).
  - 회귀 가드: 투어/방향키가 쓰는 `curTab()`도 쿼리 분리하도록 수정.
- **API/DB**: 없음(클라이언트 전용).
- **롤백**: `calc()`의 replaceState·`applyCalcParams`·`shareCalc`·버튼 제거, `go()/curTab()` 원복 또는 `git revert`.
- **DoD**: [x] 공유 링크로 슬라이더 복원, [x] 값 변경 시 URL 갱신, [x] 복사 동작, [x] 투어/방향키 회귀 없음, [x] JS·HTML 검증 통과.
