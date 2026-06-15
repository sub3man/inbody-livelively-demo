# GitHub 오픈소스 조사

> 작성일 2026-06-13 · 조사 도구: WebSearch / WebFetch (gh CLI 미사용 — 본 세션은 GitHub MCP만 접근 가능, 조사는 공개 웹 기준)

## 1. 검색 전략

현 서비스가 **단일 파일 정적 인터랙티브 피치 데모**라는 사실에서 출발해, 풀스택 SaaS 키워드(인증/마켓플레이스/워크플로우 등) 대신 **실제로 가치가 닿는 4개 축**으로 조사 범위를 좁혔다.

1. **인쇄/PDF 산출물** — 제안서는 PDF로 공유됨.
2. **프레젠테이션/슬라이드 프레임워크** — 발표 UX.
3. **차트/시각화** — 이미 Chart.js 사용 중, 대안·보강.
4. **디자인 토큰 & 정적 사이트 접근성** — 토큰 체계·a11y.

상업 서비스 적합성을 위해 **GPL/AGPL 전염성 라이선스는 가점 제외**, MIT/Apache-2.0/BSD/OFL/MPL을 우선했다.

## 2. 사용한 검색어

- `paged.js print CSS HTML to PDF library github license`
- `reveal.js impress.js slidev open source presentation framework single page`
- `Pretendard font license OFL Chart.js MIT license`
- `html2pdf.js jsPDF print to pdf client side javascript license github stars`
- `open-props design tokens css variables github MIT lightweight`

## 3. 조사한 후보 전체 목록 (20+)

프레젠테이션: reveal.js, impress.js, Slidev, Marp, remark, Spectacle, Eagle.js
인쇄/PDF: paged.js, plutobook, html2pdf.js, jsPDF, html2canvas, print-js, PDF.js
차트/시각화: Chart.js(현용), ApexCharts, ECharts, uPlot, Frappe Charts, Chartist
토큰/CSS·UI: Open Props, Pico.css, Tabler, Water.css, normalize.css
접근성: axe-core, a11y-dialog, focus-trap

## 4. 최종 후보 8–12개 (선별)

| # | 프로젝트 | URL | 라이선스 | 핵심 참고 포인트 | 가져오면 안 되는 위험 | 내 서비스 적용 방식 |
|---|---|---|---|---|---|---|
| 1 | **paged.js** | https://github.com/pagedjs/pagedjs | MIT | CSS Paged Media(페이지 분할, `@page`, break 규칙) 구현 패턴 | 런타임 무거움(전체 폴리필) — 단순 데모엔 과함 | 코드 복사 X. **`@media print` + `break-inside:avoid` + `@page margin` 패턴만 차용** |
| 2 | **reveal.js** | https://github.com/hakimel/reveal.js | MIT | 단일 페이지에서 섹션 전환, 키보드 내비, 인쇄(PDF export) 모드 UX | 전체 도입 시 마크업 구조 종속 | 발표자 모드/키보드 패턴 **아키텍처 참고**(현재 방향키 내비와 유사) |
| 3 | **impress.js** | https://github.com/impress/impress.js | MIT | CSS3 transform 기반 공간 전환 | 과한 모션은 피치에 부적합 | 전환 연출 아이디어만 참고 |
| 4 | **Slidev** | https://github.com/slidevjs/slidev | MIT | 마크다운→슬라이드, 발표자 노트 | Vue/Vite 빌드 종속(현 무빌드와 상충) | 장기 콘텐츠 분리 시 참고 |
| 5 | **html2pdf.js** | https://github.com/eKoopmans/html2pdf.js | MIT | DOM→canvas→PDF 클라이언트 변환 | html2canvas가 일부 CSS(그라디언트/필터) 부정확, 번들 큼 | 브라우저 네이티브 인쇄로 부족할 때 **선택적 보강안**으로 후순위 |
| 6 | **jsPDF** | https://github.com/parallax/jsPDF | MIT | 프로그래matic PDF 생성 | 한글 폰트 임베딩 별도 처리 필요 | 후순위(현재 불필요) |
| 7 | **ApexCharts** | https://github.com/apexcharts/apexcharts.js | MIT | 인터랙티브 차트 애니메이션·툴팁 | 현 Chart.js와 중복 의존 | **도입 안 함**. 인터랙션 디자인만 참고 |
| 8 | **uPlot** | https://github.com/leeluolee/uPlot | MIT | 초경량(~40KB) 시계열 차트 | 기능 단순 | 성능 민감 시 Chart.js 대체 후보(현재 불필요) |
| 9 | **Open Props** | https://github.com/argyleink/open-props | MIT | CSS 변수 토큰 명명/구조 체계 | 전체 도입 시 변수 폭증 | 현 `:root` 토큰을 **Open Props식 명명 규칙으로 정리**(참고) |
| 10 | **Pico.css** | https://github.com/picocss/pico | MIT | 클래스리스 시맨틱 기본 스타일 | 현 디자인과 시각 충돌 | 미도입. 시맨틱 기본값 아이디어만 |
| 11 | **axe-core** | https://github.com/dequelabs/axe-core | MPL-2.0 | 접근성 자동 점검 룰셋 | MPL은 파일 단위 카피레프트 — **번들 금지**, devtool로만 | a11y 개선 **검증 도구**로 외부 사용(코드 미포함) |
| 12 | **focus-trap** | https://github.com/focus-trap/focus-trap | MIT | 포커스 관리 패턴 | 데모엔 과함 | 향후 모달/발표자 모드 시 참고 |

## 5. 평가 점수 (100점 만점)

가중치: 관련성20 / 품질·유지보수20 / 라이선스안정15 / 구현임팩트20 / 난이도대비효율15 / 혁신성10

| 프로젝트 | 관련 | 품질 | 라이선스 | 임팩트 | 효율 | 혁신 | **합계** |
|---|--:|--:|--:|--:|--:|--:|--:|
| **paged.js (패턴 차용)** | 19 | 18 | 15 | 18 | 14 | 7 | **91** |
| **reveal.js (패턴 참고)** | 17 | 19 | 15 | 14 | 12 | 9 | **86** |
| **Open Props** | 14 | 18 | 15 | 11 | 13 | 6 | **77** |
| **html2pdf.js** | 15 | 15 | 15 | 14 | 8 | 7 | **74** |
| **axe-core (검증용)** | 12 | 19 | 12 | 13 | 12 | 5 | **73** |
| **uPlot** | 10 | 17 | 15 | 9 | 11 | 6 | **68** |
| **ApexCharts** | 10 | 18 | 15 | 8 | 7 | 6 | **64** |

## 6. 라이선스 요약 (검증 출처 포함)

- **Chart.js (현용)** — MIT. 출처: [Chart.js docs - License](https://www.chartjs.org/docs/2.9.4/notes/license.html)
- **Pretendard (현용)** — SIL Open Font License 1.1, 상업적 사용·수정·재배포 허용. 출처: [pretendard/LICENSE](https://github.com/orioncactus/pretendard/blob/main/LICENSE)
- **paged.js** — MIT. 출처: [pagedjs/pagedjs](https://github.com/pagedjs/pagedjs/)
- **reveal.js / impress.js / Slidev / html2pdf.js / jsPDF / Open Props / ApexCharts / uPlot** — MIT.
- **axe-core** — MPL-2.0 (파일 단위 카피레프트). **번들 금지**, 외부 점검 도구로만 사용 가능.

> ⚠️ 본 작업의 실제 구현은 **어떤 OSS 코드도 복사·번들하지 않았다.** paged.js/reveal.js의 *print-CSS·키보드 내비 패턴(아이디어)* 만 참고했다.

## 7. 우선순위 & 최종 추천 Top 3

1. **🥇 print-CSS 패턴 (paged.js 영감, 코드 미사용)** — 죽은 export 버튼을 살리는 데 즉시 적용. 의존성 0, 라이선스 리스크 0, 오프라인 동작. → **본 작업에서 구현 완료.**
2. **🥈 reveal.js식 키보드/발표자 내비 패턴** — 이미 방향키 내비가 있으므로 발표자 모드로 확장 시 자연스러움. 중기.
3. **🥉 Open Props식 토큰 정리** — 현 `:root` 토큰을 표준 명명으로 정돈해 유지보수성↑. 저리스크·점진.

## Sources

- [Paged.js — GitHub](https://github.com/pagedjs/pagedjs/) · [Paged.js docs](https://pagedjs.org/en/documentation/1-the-big-picture/)
- [reveal.js](https://revealjs.com/) · [Top JS presentation frameworks](https://byby.dev/js-presentation-libs)
- [Chart.js License](https://www.chartjs.org/docs/2.9.4/notes/license.html)
- [Pretendard LICENSE](https://github.com/orioncactus/pretendard/blob/main/LICENSE)
- [html2pdf.js — GitHub](https://github.com/eKoopmans/html2pdf.js)
- [Open Props — GitHub](https://github.com/argyleink/open-props) · [open-props.style](https://open-props.style/)
