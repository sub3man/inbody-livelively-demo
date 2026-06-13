# InBody × 리브라이블리 협업 데모

> InBody 정밀 측정을 고령자 생활현장의 **방문운동 → 재측정 성과**로 전환하는 InBodyLIKE 협업 시나리오를, 투자/제휴 대상에게 보여주기 위한 **단일 파일 인터랙티브 피치 데모**.

측정 → AI 위험분류 → 방문운동 → 생활습관 코칭 → **12주 재측정·리포트**의 폐쇄 루프를 5개 탭으로 보여줍니다.

## 빠른 시작

빌드가 필요 없습니다. 정적 파일을 그대로 열면 됩니다.

```bash
# 가장 간단: 브라우저로 index.html 열기
# 또는 로컬 서버(공유 링크·클립보드 등 일부 기능은 http에서 더 안정적):
python3 -m http.server 8000   # → http://localhost:8000
```

## 구성

```
index.html            # 전부: 인라인 CSS + 마크업 + 바닐라 JS (프레임워크/빌드 없음)
photo-*.jpg           # 현장 사진 자산
scripts/
  check.sh            # 검증 일괄 실행 (JS 문법 + HTML 균형 + 스모크 테스트)
  smoke-test.mjs      # 헤드리스 스모크 테스트 (탭/딥링크 무예외 검증, 의존성 0)
vendor/
  fetch-assets.sh     # (선택) 오프라인 발표용 CDN 자산 로컬 번들링 스크립트
  README.md           # 오프라인 번들링 안내
docs/                 # 분석·OSS 조사·기획·검증 문서 6종
```

외부 의존성은 **CDN 2개**뿐: [Chart.js](https://www.chartjs.org/) (MIT), [Pretendard](https://github.com/orioncactus/pretendard) (SIL OFL 1.1). 라이선스 상세는 [`docs/open-source-attribution.md`](docs/open-source-attribution.md).

## 탭

| 탭 | 내용 |
|---|---|
| 파트너십 개요 | 5단계 루프, 위험도 분류 **시뮬레이터**(슬라이더), 역할 분담, 관리지표 |
| CareFlow OS | 운영 대시보드 목업(KPI·일정·참여자 표·차트) |
| NoriCare | 모바일 앱 목업(폰 3대) + 12주 성과 추적 차트 |
| 성과 리포트 | Baseline→W12 변화표, 개선율 차트, 타임라인·로드맵, 공동 리포트 미리보기 |
| 협업 제안 | 역할 카드, 임팩트 **시뮬레이터**, 4개월 일정, 연락처 |

## 기능 / 사용법

- **탭 이동**: 상단 탭 클릭, 좌우 방향키(`←`/`→`), 또는 우하단 가이드 투어 버튼. URL 해시(`#cf` 등)로 딥링크 가능. 키보드(Tab/Enter)로도 조작 가능(접근성).
- **인쇄 / PDF**: 각 화면의 "PDF 내보내기 / 결과보고서 내보내기 / 보호자 리포트 / 내보내기" 버튼 → 브라우저 인쇄로 **현재 탭만** 깔끔히 출력(제안 문서화). 의존성 없음.
- **시나리오 공유 링크**: 협업 제안 탭의 임팩트 시뮬레이터에서 슬라이더 조정 후 **"시나리오 링크 복사"** → 그 수치가 담긴 URL(`#ask?gu=&pp=&cy=`)이 복사됨. 링크를 열면 슬라이더·결과가 복원됩니다.
- **발표 모드**: `F` 키 또는 상단 "발표 모드" 버튼 → 전체화면(브라우저 UI 제거, nav 배지 정리).
- **접근성**: 키보드 포커스 링, `prefers-reduced-motion` 존중(애니메이션/카운트업 정지).
- **동적 날짜**: D-카운터·리포트 생성일·앱 홈 날짜는 **오늘 기준 자동 계산**(PoC 시작 앵커는 고정).

## 커스터마이즈 (다른 자치구/대상자용 데모)

`index.html`의 인라인 `<script>` 안:

- **참여자 목록**: `const clients = [ … ]`
- **12주 추이 차트**: `const mdata = { … }`, 주차 라벨 `const wks = [ … ]`
- **요약 차트 데이터셋**: `const perfChart`, `const aggChart` (`// DEMO DATA` 배너 블록)
- **PoC 시작일(동적 날짜 앵커)**: `const POC_START = new Date(2026, 6, 20)` (월은 0-based → 7월)
- **인쇄 기능 토글**: `const FEATURES = { printExport: true }`

> KPI strip·리포트 표의 일부 숫자는 마크업에 직접 들어 있어, 해당 위치에서 수정합니다.

## 검증

```bash
bash scripts/check.sh        # 문법 + HTML 균형 + 스모크 테스트 일괄
node scripts/smoke-test.mjs  # 스모크 테스트만
```

스모크 테스트는 각 탭(딥링크 포함)으로 **신선하게 로드**되는 상황을 최소 DOM 셰임에서 실행해 예외가 없는지 확인합니다 — `#cf`/`#nc`/`#rpt` 딥링크에서 발생했던 TDZ 류 회귀를 자동으로 차단합니다.

## 오프라인 발표

기본은 CDN을 사용하되, 폰트 CDN 실패 시 한글 시스템 폰트로, Chart.js 실패 시 안내 문구로 **graceful degradation** 됩니다. 완전 오프라인이 필요하면 네트워크 가능 환경에서 `bash vendor/fetch-assets.sh` 실행(자세한 내용: [`vendor/README.md`](vendor/README.md)).

## 문서

`docs/` — 현재 서비스 분석 · OSS 조사 · 혁신 기회 · 실행 계획 · OSS 고지 · 검증 보고서.

## 연락처

리브라이블리(주) · LIVELIVELY INC. — [ceo@livelively.kr](mailto:ceo@livelively.kr) · [www.livelively.kr](https://www.livelively.kr)
