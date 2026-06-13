# 오픈소스 고지 (Attribution)

> 작성일 2026-06-13

## 1. 런타임에 실제 포함되는 외부 자산

`index.html`이 로드하는 서드파티 자산. 모두 상업적 사용 가능 라이선스.

| 자산 | 용도 | 라이선스 | 로드 방식 | 출처 |
|---|---|---|---|---|
| **Chart.js 4.4.0** | 차트(막대/라인) 렌더 | MIT | cdnjs CDN | https://www.chartjs.org/ · [License](https://www.chartjs.org/docs/2.9.4/notes/license.html) |
| **Pretendard 1.3.9 (Variable)** | 한글 본문 웹폰트 | SIL Open Font License 1.1 | jsDelivr CDN | https://github.com/orioncactus/pretendard · [LICENSE](https://github.com/orioncactus/pretendard/blob/main/LICENSE) |

> SIL OFL 1.1 준수 사항: 폰트 자체를 재판매하지 않으며, 폰트를 로컬 동봉하게 될 경우 원본 라이선스 파일을 함께 포함한다(현재는 CDN 로드라 별도 동봉 없음).

## 2. 패턴/아이디어만 참고한 프로젝트 (코드 미복사)

아래 프로젝트의 **코드는 복사·번들하지 않았다.** 설계 아이디어(패턴)만 참고했다.

| 프로젝트 | 라이선스 | 참고한 개념 | 복사 여부 |
|---|---|---|---|
| **paged.js** | MIT | `@media print` / `@page` 여백 / `break-inside:avoid`로 페이지 분할 제어하는 **인쇄-CSS 패턴** | ❌ 코드 미사용. 개념만 |
| **reveal.js** | MIT | 단일 페이지 섹션 전환 + 키보드 내비 + "현재 뷰만 인쇄" UX 아이디어 | ❌ 코드 미사용. 개념만 |

본 사이클에 추가된 인쇄 기능(`@media print` 블록, `printDoc()`)은 **표준 웹 플랫폼 API(`window.print()`)와 표준 CSS만으로 직접 작성**했으며, 위 프로젝트의 소스를 포함하지 않는다.

## 3. 도입을 검토했으나 채택하지 않은 것

| 프로젝트 | 라이선스 | 미채택 사유 |
|---|---|---|
| html2pdf.js / jsPDF / html2canvas | MIT | 브라우저 네이티브 인쇄로 충분. 번들 비대화·한글 폰트 임베딩 부담 |
| ApexCharts / ECharts / uPlot | MIT | Chart.js와 중복. 현 요구에 불필요 |
| Open Props / Pico.css | MIT | 현 디자인 토큰으로 충분. 전체 도입은 과함 |
| **axe-core** | **MPL-2.0** | 파일 단위 카피레프트 → **번들 금지**. 접근성 점검은 외부 도구로만 사용 |

## 4. 라이선스 정책 요약

- 채택 가능: MIT / Apache-2.0 / BSD / SIL OFL.
- 주의(번들 금지, 외부 도구로만): MPL-2.0(axe-core 등).
- 금지: GPL / AGPL 등 전염성 라이선스의 소스 포함.
- 원칙: **라이선스 확인 없이 외부 코드를 직접 복사하지 않는다.**
