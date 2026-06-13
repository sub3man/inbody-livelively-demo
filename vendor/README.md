# vendor/ — 오프라인 발표용 자산 번들링

현장 발표 중 네트워크가 끊겨도 폰트·차트가 깨지지 않도록, 외부 CDN 자산을 저장소에 동봉하기 위한 폴더입니다.

## 현재 상태

- 기본 `index.html`은 여전히 **CDN**(Pretendard·Chart.js)을 사용합니다.
- 코드에는 이미 **무다운로드 복원력**이 적용돼 있습니다:
  - 한글 시스템 폰트 폴백 스택(폰트 CDN 실패 시 Apple SD Gothic Neo / 맑은 고딕 등으로 표시).
  - Chart.js 미로딩 시 `ensureChart()`가 빈 캔버스 대신 안내 문구로 대체(페이지 비충돌).

## 완전 오프라인으로 전환하려면

> ⚠️ 이 자산 다운로드는 **외부 네트워크가 차단된 빌드 샌드박스에서는 실행되지 않습니다**(CDN 403). 인터넷이 되는 로컬/서버 환경에서 아래를 실행하세요.

```bash
bash vendor/fetch-assets.sh
```

스크립트가 하는 일:
1. `vendor/chart.umd.min.js` (Chart.js 4.4.0, MIT) 다운로드
2. `vendor/pretendard/…` (Pretendard 1.3.9 Variable, SIL OFL 1.1) CSS + woff2 다운로드
3. 각 라이선스 파일 동봉(`Chart.js-LICENSE.md`, `pretendard/Pretendard-LICENSE`)
4. `index.html`의 두 CDN 링크를 로컬 경로로 치환(백업 `index.html.bak` 생성)

되돌리기: `mv index.html.bak index.html`

## 라이선스

- **Chart.js** — MIT (https://www.chartjs.org/)
- **Pretendard** — SIL Open Font License 1.1 (https://github.com/orioncactus/pretendard) · 폰트 동봉 시 OFL 라이선스 파일을 반드시 함께 배포합니다.
