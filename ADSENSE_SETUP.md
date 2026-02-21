# AdSense 설정/검증 가이드

이 문서는 `SkyStat` 배포 이후, AdSense 심사 직전에 필요한 연결 작업과 검증 순서를 정리한 실행 문서입니다.

기준 운영 URL: `https://sky-stat.com`

## 1) 심사 직전 필수 설정 (배포 완료 후)

### 1-1. 환경변수 입력
- 권장: `.env.adsense-review.example`을 `.env`로 복사한 뒤, `REPLACE_*` 값만 실제 값으로 교체합니다.
- 일반 개발용 기본 템플릿은 `.env.example`을 사용합니다.
- `.env`에 아래 항목 설정
  - `VITE_ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXX`
  - `VITE_ADSENSE_ENABLE_SLOTS=true`
  - 참고:
  - AdSense 계정/사이트 등록 후 발급된 `pub-...` 값을 입력합니다.
  - `index.html`은 위 값을 기준으로 AdSense 스크립트(`adsbygoogle.js`)를 자동 주입합니다.
  - 동일 값을 Funding Choices(CMP) publisherId에도 재사용합니다.
  - 광고 슬롯 ID는 아래 키별로 입력합니다(숫자만):
    - `VITE_ADSENSE_SLOT_HOME_MAIN`
    - `VITE_ADSENSE_SLOT_GUIDE_MAIN`
    - `VITE_ADSENSE_SLOT_FAQ_MAIN`
    - `VITE_ADSENSE_SLOT_REPORT_MAIN`
    - `VITE_ADSENSE_SLOT_DASHBOARD_MAIN`
    - `VITE_ADSENSE_SLOT_VISIBILITY_BOTTOM`
    - `VITE_ADSENSE_SLOT_WIND_BOTTOM`
    - `VITE_ADSENSE_SLOT_ALTIMETER_BOTTOM`
    - `VITE_ADSENSE_SLOT_WEATHER_BOTTOM`
    - `VITE_ADSENSE_SLOT_TEMPERATURE_BOTTOM`
    - `VITE_ADSENSE_SLOT_WINDROSE_BOTTOM`

### 1-1-1. 코드 기준 슬롯 배치(현재 적용됨)
- `home_main`: Home 기능 카드 섹션과 기능 매핑 섹션 사이
- `guide_main`: Guide METAR 코드 참고 섹션과 활용 팁 섹션 사이
- `faq_main`: FAQ 목록 하단
- `report_main`: Report 월별 관측 일수 테이블 하단(면책 안내 위)
- `dashboard_main`: Dashboard 월별 관측 일수 테이블 하단
- `visibility_bottom`: Visibility 하단
- `wind_bottom`: Wind 하단
- `altimeter_bottom`: Altimeter 하단
- `weather_bottom`: Weather 하단
- `temperature_bottom`: Temperature 하단
- `windrose_bottom`: Windrose 하단

### 1-2. ads.txt 1줄 교체
- 파일: `public/ads.txt`
- 아래 1줄의 `REPLACE_WITH_REAL_PUBLISHER_ID`만 실제 값으로 교체
  - `google.com, pub-REPLACE_WITH_REAL_PUBLISHER_ID, DIRECT, f08c47fec0942fa0`

### 1-3. 정책/신뢰 페이지 노출 확인
- 상단/푸터에서 아래 링크 접근 가능해야 함
  - `/about`
  - `/guide`
  - `/faq`
  - `/privacy`
  - `/terms`
  - `/contact`

## 2) 배포 직후 검증 순서 (실 URL 기준)

아래 순서대로 확인하면 승인/운영 리스크를 가장 빠르게 줄일 수 있습니다.

### Step 1. robots/sitemap 확인
1. `https://sky-stat.com/robots.txt` 접속
2. `Sitemap: https://sky-stat.com/sitemap.xml` 포함 여부 확인
3. `https://sky-stat.com/sitemap.xml` 접속
4. 공개 정보 페이지/분석 페이지 URL이 모두 포함되었는지 확인

### Step 2. ads.txt 확인
1. `https://sky-stat.com/ads.txt` 접속
2. 실제 pub ID가 반영된 1줄이 보이는지 확인

### Step 3. AdSense 스크립트 로드 확인
1. `https://sky-stat.com/` 접속
2. 개발자도구 Network에서 `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` 요청 확인
3. 요청 URL에 `client=ca-pub-...` 포함 확인

### Step 4. CMP(Funding Choices) 로드 확인 (EEA/UK/CH 시나리오)
1. 시크릿 창으로 `https://sky-stat.com/` 접속
2. 가능하면 EEA/UK/CH IP(VPN/프록시)로 테스트
3. Network에서 `fundingchoicesmessages.google.com` 요청 확인
4. `googlefcPresent` iframe 생성 확인
5. CMP 배너/팝업 노출 확인

### Step 5. 동의 상태 반영 확인
1. 동의/거부 각각 수행
2. 새로고침 후 상태 유지 확인
3. `gtag consent` 업데이트가 정상 반영되는지 확인

### Step 6. SPA 직접 URL fallback 확인
1. 아래 URL을 주소창에 직접 입력 후 새로고침
  - `https://sky-stat.com/report/RKSI?from=2023-01-01&to=2024-01-01`
  - `https://sky-stat.com/guide`
  - `https://sky-stat.com/dashboard`
2. 404 없이 앱이 정상 렌더링되면 통과

### Step 7. 모바일 UI/광고 인접 정책 확인
1. 모바일 뷰에서 검색 버튼, 토글, 정렬 버튼 근처에 광고 슬롯이 붙지 않았는지 확인
2. 오인 클릭 유도 배치(콘텐츠 위장/버튼 위장) 없는지 확인

## 3) 승인 전 콘텐츠 품질 점검

- `Guide`: 지표 해석/임계값/코드 안내가 충분한지
- `FAQ`: 정책/데이터/기술 질문이 충분한지
- `Report`: KPI/차트/월별 관측 데이터가 실제로 읽히는지
- 빈 페이지/미완성 페이지 없이 주요 URL 모두 콘텐츠가 있는지

## 4) 트러블슈팅

### 4-1. adsbygoogle.js가 안 뜨는 경우
- `.env`의 `VITE_ADSENSE_PUBLISHER_ID` 형식 확인 (`pub-숫자열`)
- 빌드/배포 캐시 무효화 후 재배포

### 4-2. CMP가 안 뜨는 경우
- EEA/UK/CH 외 지역에서는 노출되지 않을 수 있음
- Funding Choices 설정이 계정/사이트에 반영됐는지 확인

### 4-3. 직접 URL 접속 시 404
- 서버/호스팅 리라이트에서 SPA fallback(`index.html`) 설정 필요

### 4-4. CLS(레이아웃 흔들림)
- 광고 슬롯 컨테이너에 `min-height` 사전 지정
- 모바일/데스크톱 별 슬롯 높이 점검

---

운영 메모:
- 정책 문구(Privacy/Terms)와 실제 광고/쿠키 동작은 항상 일치해야 합니다.
- 수익 최적화보다 정책 준수와 UX 안정성을 우선합니다.
