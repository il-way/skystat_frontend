import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  ko: {
    translation: {
      nav: {
        about: "About",
        guide: "Guide",
        faq: "FAQ",
        terms: "Terms",
        privacy: "Privacy",
        contact: "Contact",
      },
      actions: {
        home: "홈",
        analyze: "분석하기",
        search: "검색",
        loadingQuery: "조회 중...",
        openReport: "리포트 열기",
        viewGuide: "가이드 보기",
        viewSampleReport: "샘플 리포트 보기",
      },
      labels: {
        icao: "ICAO",
        from: "시작일(From)",
        to: "종료일(To)",
        airportCode: "공항 코드",
      },
      units: {
        records: "건",
      },
      trail: {
        analytics: "Analytics",
        summary: "Summary",
        noData: "No Data",
        error: "Error",
        preview: "Preview",
      },
      dashboard: {
        pageName: "Dashboard",
        coverage: "데이터 커버리지(포함)",
        guide: {
          title: "대시보드 안내",
          guideButton: "가이드 보기",
          sampleButton: "샘플 리포트",
          bullet1: "ICAO와 UTC 기간(From 포함, To 미포함)을 설정한 뒤 검색을 누르세요.",
          bullet2: "하단 카드: 표본수/평균 시정/평균 운고/평균 풍속을 요약합니다.",
          bullet3: "차트: 선택 기간의 연월 평균 추세를 보여줍니다.",
          bullet4: "테이블: 임계값 조건을 만족한 월별 일수를 집계합니다.",
        },
        kpi: {
          sectionTitle: "핵심 지표",
          sampleSize: "표본수",
          avgVisibility: "평균 시정",
          avgCeiling: "평균 운고",
          avgWind: "평균 풍속",
        },
        chart: {
          title: "평균 풍속 시계열",
          subtitle: "선택 기간의 연월 평균 추세",
        },
        table: {
          title: "월별 관측 일수",
          subtitle: "임계값 기준 월별 발생 일수 집계",
        },
      },
      reportPage: {
        seo: {
          title: "{{icao}} 보고서",
          description: "{{icao}} 공항의 공개 기상 통계 분석 보고서 페이지입니다.",
        },
        breadcrumb: {
          report: "리포트",
        },
        header: {
          title: "공항별 기상 통계 분석 보고서",
          icaoLabel: "ICAO",
          periodInclusive: "기간(포함)",
          coverageInclusive: "데이터 커버리지(포함)",
          periodToggle: "기간 변경",
          copyLink: "링크 복사",
          from: "From",
          to: "To",
          toHint: "종료일(To)은 포함되지 않으며, 실제 조회는 To 이전까지 집계됩니다.",
          apply: "적용",
          invalidPeriod: "기간을 다시 확인해주세요",
          loading: "실데이터를 불러오는 중...",
          loadError: "실데이터 조회에 실패해 예시 데이터로 표시될 수 있습니다.",
          presets: {
            recent1y: "최근 1년",
            recent3y: "최근 3년",
            recent5y: "최근 5년",
            all: "전체",
            reset: "Reset",
          },
        },
        summary: {
          base: "선택 기간(포함) 기준, 평균 시정은 {{visibility}}, 평균 풍속은 {{wind}}입니다.",
          peak: "저시정(≤{{visibility}}m)은 {{visMonth}}에 {{visDays}}일로 최다, 강풍(피크≥{{wind}}kt)은 {{windMonth}}에 {{windDays}}일로 최다입니다.",
          coverage: "데이터 커버리지는 {{from}}~{{to}}입니다.",
        },
        kpi: {
          sectionTitle: "관측 현황",
          sampleSize: "표본수",
          avgVisibility: "평균시정",
          avgCeiling: "평균운고",
          avgWind: "평균풍속",
        },
        chart: {
          windTitle: "평균 풍속 시계열",
          visibilityTitle: "평균 시정 시계열",
          subtitle: "Monthly Average (selected period)",
          windSeries: "풍속",
          visibilitySeries: "시정",
          note: "참고: 월별 평균은 ‘평시 상태’를 요약합니다. 운항 영향은 아래 ‘임계값 초과 일수’ 지표가 더 직접적입니다.",
        },
        monthly: {
          title: "월별 관측 일수",
          conditionsLabel: "집계 조건",
          strongWind: "강풍(피크)",
          lowVisibility: "저시정",
          lowCeiling: "저운고",
          thunderstormShort: "뇌전",
          snowShort: "눈",
          recent12: "최근 12개월",
          all: "전체",
          displayRecent: "표시: 최근 12개월({{shown}}/{{total}})",
          displayAll: "표시: 전체({{shown}})",
          peakVisibility: "저시정(≤{{threshold}}m) 최다: {{month}} · {{days}}일",
          peakWind: "강풍(피크≥{{threshold}}kt) 최다: {{month}} · {{days}}일",
          noEvent: "해당 조건에서 이벤트가 없습니다",
          noData: "데이터가 없습니다.",
          headers: {
            month: "Month",
            monthSub: "(YYYY-MM)",
            windPeak: "WindPeak",
            windPeakSub: "(≥ {{value}} kt)",
            visibility: "Visibility",
            visibilitySub: "(≤ {{value}} m)",
            ceiling: "Ceiling",
            ceilingSub: "(≤ {{value}} ft)",
            thunderstorm: "Thunderstorm",
            snow: "Snow",
          },
        },
        disclaimer: {
          title: "면책 안내",
          body: "본 보고서는 공개 기상 관측 데이터를 기반으로 한 통계 요약입니다. 실제 운항 의사결정에는 공식 기상 브리핑과 운항 규정을 함께 확인해야 합니다.",
        },
        fallback: {
          airportName: "샘플 공항",
          region: "공개 예시 데이터",
          summary: "요청한 ICAO의 사전 정의 데이터가 없어 기본 예시 값으로 보고서를 표시합니다.",
          disclaimer: "표시된 수치는 예시 데이터이며 실제 운항 의사결정에 사용될 수 없습니다. 공식 기상 정보와 운항 지침을 확인하세요.",
        },
        toast: {
          copySuccess: "링크가 복사되었습니다.",
          copyFail: "복사에 실패했습니다. 주소를 직접 복사해주세요.",
        },
      },
      analysis: {
        filters: {
          visibilityThreshold: "시정 기준(≤m)",
          windThreshold: "풍속 기준(≥kt)",
          altimeterThreshold: "기압 기준(≤hPa)",
          weatherCode: "현상 코드",
          weatherCodePlaceholder: "코드 선택",
        },
        pages: {
          temperature: "기온",
          windrose: "풍향장미",
        },
        guide: {
          title: "활용 가이드",
          visibility: {
            1: "ICAO와 UTC 기간(From 포함, To 미포함)을 설정하고 시정 기준(≤ N m)을 입력한 뒤 검색하세요.",
          },
          wind: {
            1: "ICAO와 UTC 기간(From 포함, To 미포함)을 설정하고 풍속 기준(≥ N kt)을 입력한 뒤 검색하세요.",
          },
          altimeter: {
            1: "ICAO와 UTC 기간(From 포함, To 미포함)을 설정하고 기압 기준(≤ N hPa)을 입력한 뒤 검색하세요.",
          },
          weather: {
            1: "ICAO와 UTC 기간(From 포함, To 미포함)을 설정하고 기상 코드(예: SN, TS, FG)를 선택한 뒤 검색하세요.",
            3: "월별은 코드가 포함된 일수를, 시간대별은 선택한 연/월 기준 UTC 시간대별 발생 건수를 보여줍니다.",
            5: "코드 또는 기간을 변경해 시나리오를 비교할 수 있으며, 모든 수치는 선택한 기간과 필터를 반영합니다.",
          },
          temperature: {
            1: "ICAO와 UTC 기간(From 포함, To 미포함)을 설정한 뒤 검색하세요.",
            2: "하단 카드는 표본수, 연평균 기온(℃), 관측 최고/최저 기온(℃)을 요약합니다.",
            3: "월별(그래프)은 월 단위 평균기온, 평균 최고기온, 평균 최저기온 추이를 보여줍니다.",
            4: "시간대별(그래프)은 선택한 연/월 기준 UTC 시간대별 평균기온을 보여줍니다.",
            5: "표에서는 연도/월 단위로 평균 기온, 평균 최고/최저 기온을 확인할 수 있습니다.",
            overline: "윗줄 표기(overline)는 평균값을 의미합니다.",
          },
          windrose: {
            1: "ICAO와 UTC 기간(From 포함, To 미포함)을 설정한 뒤 검색하세요.",
            2: "극좌표 차트는 풍향별 빈도(%)를 풍속 구간(kt)으로 누적해 보여주며, 중심에는 정온(Calm) 비율이 표시됩니다. (돌풍은 제외)",
            3: "현재 데이터는 {{count}}개 방위 구간으로 집계됩니다.",
            4: "언제든 그래프/표 전환이 가능하며, month 선택값으로 월별 패턴을 비교할 수 있습니다.",
            5: "기간을 변경해 시나리오를 비교할 수 있으며, 모든 수치는 선택한 기간과 필터를 반영합니다.",
          },
          common: {
            2: "하단 카드는 표본수, 관측 일수, 최빈 월/시간을 요약합니다.",
            3: "월별은 임계값을 만족한 일수를, 시간대별은 선택한 연/월 기준 UTC 시간대별 발생 건수를 보여줍니다.",
            4: "언제든 그래프/표 전환이 가능하며, total/year와 month 선택값으로 결과를 세분화할 수 있습니다.",
            5: "기준값을 조정하면 시나리오 비교가 가능하며, 모든 수치는 선택한 기간과 임계값을 반영합니다.",
          },
        },
        kpi: {
          sectionTitle: "핵심 지표",
          sampleSize: "표본수",
          observedDays: "관측 일수",
          mostFrequentMonth: "최빈 월",
          mostFrequentHour: "최빈 시간",
          daysHint: "days",
          monthHint: "month",
          utcAt: "UTC at {{month}}",
          notSearched: "조회 전",
        },
        monthly: {
          title: "월별 관측 일수",
        },
        hourly: {
          title: "시간대별 관측 일수",
        },
        temperature: {
          kpi: {
            annualMean: "연평균 기온",
            maxTemp: "최고 기온",
            minTemp: "최저 기온",
            temperatureUnitHint: "temperature [℃]",
          },
          chart: {
            legend: {
              meanTMax: "평균 최고기온",
              meanT: "평균 기온",
              meanTMin: "평균 최저기온",
            },
          },
          table: {
            t: "T",
            tMax: "T_max",
            tMin: "T_min",
          },
        },
        windrose: {
          gustHint: "[%] gusts not included",
          monthlyDistTitle: "월별 풍향/풍속 분포",
          noData: "표시할 데이터가 없습니다.",
          direction: "풍향",
          kpi: {
            variableRatio: "변풍 비율",
            speedBins: "풍속 단계",
            directionBins: "풍향 단계",
            levelsHint: "단계",
            cardinalHint: "방위",
          },
        },
        common: {
          year: "연도",
          month: "월",
          hour: "시각",
          count: "건수",
          total: "전체",
          totalUpper: "전체",
          graph: "그래프",
          table: "표",
        },
      },
      home: {
        seo: {
          title: "공항별 기상 통계 분석 서비스",
          description: "METAR 기반 시정/운고/바람/현상 통계 리포트를 제공하는 공개 랜딩 페이지입니다.",
        },
        hero: {
          eyebrow: "SKY WEATHER ANALYTICS",
          title: "공항별 기상 통계 분석 서비스",
          body1: "METAR 관측 데이터를 기반으로 시정, 운고, 바람, 기상현상 지표를 공항별로 분석합니다.",
          body2: "기간을 지정해 보고서를 열고 운영/기획에 필요한 통계 패턴을 빠르게 확인할 수 있습니다.",
        },
        sections: {
          featuresTitle: "어떤 분석을 제공하나요?",
          featuresDescription: "시정·운고·바람·현상 지표를 기간별로 빠르게 요약합니다.",
          mappingTitle: "공항별 METAR 통계 분석 기능 매핑",
          mappingDescription: "시정, 운고, 바람, 현상 데이터를 시각화 카드로 구성해 빠르게 비교할 수 있습니다.",
          recommendTitle: "추천 공항 리포트",
          recommendDescription: "많이 조회되는 공항을 빠르게 열어 비교해보세요.",
          coreBadge: "핵심",
          airportReportLabel: "대표 리포트",
          airportSummary: "시정·운고·바람·현상 요약",
        },
        featureCards: {
          visibility: {
            title: "시정 통계",
            description: "시간별·월별 시정 분포를 빠르게 확인",
            point1: "저시정 발생 월 식별",
            point2: "시간대별 시정 변동 패턴 비교",
            chip1: "월별 분포",
            chip2: "시간 패턴",
            chip3: "저시정 일수",
          },
          ceiling: {
            title: "운고 통계",
            description: "운저고도 구간별 발생 패턴 분석",
            point1: "저운고 집중 구간 확인",
            point2: "월별·시간별 저운고 발생 추이 파악",
            chip1: "운고 구간",
            chip2: "월별 추이",
            chip3: "저운고 일수",
          },
          wind: {
            title: "바람 통계",
            description: "풍향·풍속 분포와 강풍 빈도 분석",
            point1: "강풍 이벤트 빈도 월간 비교",
            point2: "평균 풍속 추이",
            chip1: "풍속 분포",
            chip2: "강풍 이벤트",
            chip3: "월별 추세",
          },
          weather: {
            title: "현상 통계",
            description: "강수·안개·뇌전 등 현상 발생 경향 정리",
            point1: "TS/SN 코드 포함 일수 집계",
            point2: "저시정 동반 현상 여부 확인",
            chip1: "TS/SN",
            chip2: "강수·안개",
            chip3: "코드 빈도",
          },
        },
        mappingCards: {
          visCeiling: {
            title: "시정/운고 매핑 리포트",
            description: "월별, 시간대별 시정-운고 분포를 카드형으로 제공합니다.",
          },
          wind: {
            title: "풍향/풍속 매핑 리포트",
            description: "풍향 장미도와 풍속 구간 비율을 한 화면에서 비교합니다.",
          },
          event: {
            title: "기상현상 이벤트 매핑",
            description: "강수, 안개, 뇌전 등 주요 현상 빈도와 기간을 요약합니다.",
          },
        },
        preview: {
          monthlyHourly: "월별/시간대",
          windRatio: "풍속 구간 비율",
          rainRun: "강수 연속 구간",
          lowVisibilityCompanion: "저시정 동반",
          eventPeakMonth: "이벤트 피크월",
        },
      },
      aboutPage: {
        seo: {
          title: "About",
          description: "SkyStat 서비스 소개 및 데이터 범위 안내",
        },
        header: {
          title: "About SkyStat",
          description: "SkyStat 서비스 소개와 공개 통계 데이터 범위를 간단히 안내합니다.",
          guideButton: "가이드 보기",
          sampleButton: "샘플 리포트",
        },
        sections: {
          overview: {
            title: "SkyStat 소개",
            body: "SkyStat는 공항별 METAR 데이터를 기반으로 시정·운고·바람·기상현상 통계를 공개 리포트 형태로 제공하는 서비스입니다.",
          },
          range: {
            title: "데이터 범위",
            prefix: "공개 통계 기준 데이터 범위는",
            suffix: "입니다.",
          },
          report: {
            title: "리포트 구성",
            body: "리포트는 KPI 요약 카드, 연월 평균 추세 차트, 임계값 기반 월별 관측 일수 테이블로 구성됩니다.",
          },
          disclaimer: {
            title: "면책",
            body: "본 서비스의 공개 통계는 참고용 요약 정보이며, 공식 브리핑·관제 지시·운항 규정을 대체할 수 없습니다.",
          },
          contact: {
            title: "문의",
          },
        },
      },
      guidePage: {
        seo: {
          title: "가이드",
          description: "공개 리포트에서 사용하는 주요 기상 지표와 임계값 해석 방법을 안내합니다.",
        },
        hero: {
          eyebrow: "GUIDE",
          title: "가이드",
          description: "공개 리포트에서 사용하는 주요 기상 지표와 임계값 해석 방법을 안내합니다.",
          primaryCta: "월별 리포트 열기",
        },
        sectionShortcuts: {
          metrics: "주요 지표",
          thresholds: "임계값",
          tips: "활용 팁",
        },
        examples: {
          show: "예시 보기",
          hide: "예시 숨기기",
          label: "예시:",
        },
        metrics: {
          title: "주요 지표 해석하기",
          subtitle: "이 지표는 리포트의 KPI/차트/월별 관측 일수와 연결됩니다.",
          sampleLink: "샘플 리포트에서 확인하기",
          cards: {
            sampleSize: {
              title: "표본수(건)",
              description: "선택 기간 동안 집계에 사용된 METAR 보고서 건수입니다.",
              tip: "해석 팁: 표본수가 적은 구간은 평균 해석에 주의하세요.",
              example: "예: 표본수가 적으면(예: 2,000건) 평균 해석을 보수적으로 보세요.",
            },
            avgVisibility: {
              title: "평균 시정(km)",
              description: "선택 기간의 평균 시정 수준을 요약합니다(평균은 평시 상태에 가까움).",
              tip: "해석 팁: 리스크 평가는 저시정 임계 초과 일수와 함께 보세요.",
              example: "예: 8.8km면 대체로 양호하나, 저시정(≤800m) 일수도 함께 확인하세요.",
            },
            avgCeiling: {
              title: "평균 운고(ft)",
              description: "운고 평균으로, 저운고 빈도는 아래 임계값 지표가 더 직접적입니다.",
              tip: "해석 팁: 평균이 높아도 특정 월의 저운고 집중 여부를 확인하세요.",
              example: "예: 평균이 높아도 특정 월의 저운고(≤300ft) 일수 집중 여부를 확인하세요.",
            },
            avgWind: {
              title: "평균 풍속(kt)",
              description: "풍속 평균(kt)으로, 강풍 리스크는 피크/임계 초과 일수로 확인합니다.",
              tip: "해석 팁: 월별 피크풍속 초과 일수와 함께 해석하세요.",
              example: "예: 평균 7kt라도 강풍(피크≥30kt) 일수가 많으면 운항 영향이 커질 수 있습니다.",
            },
          },
        },
        thresholds: {
          title: "임계값 설명하기",
          cards: {
            strongWind: {
              title: "강풍(피크) ≥ 30kt",
              description: "돌풍/피크 풍속이 기준 이상인 ‘일수’를 월별로 집계합니다.",
              example: "예: 어떤 달에 6일이면, 그 달은 강풍 이벤트가 잦았다는 의미입니다.",
            },
            lowVisibility: {
              title: "저시정 ≤ 800m",
              description: "저시정 기준을 만족한 날을 월별로 집계합니다.",
              example: "예: 월별 0~10일처럼 ‘일수’로 집계되어 리스크를 빠르게 비교합니다.",
            },
            lowCeiling: {
              title: "저운고 ≤ 300ft",
              description: "저운고 기준을 만족한 날을 월별로 집계합니다.",
              example: "예: 특정 계절에 일수가 늘면 접근/출발 운영 영향이 커질 수 있습니다.",
            },
            tsSn: {
              title: "TS / SN",
              description: "METAR 코드(Thunderstorm/Snow)가 포함된 보고서를 월별로 집계합니다.",
              example: "예: TS 2일, SN 0일처럼 코드 포함 빈도를 월별로 확인합니다.",
            },
          },
        },
        metar: {
          title: "METAR 코드 빠른 참고",
          description: "리포트의 TS/SN 등 코드 집계는 METAR 원문에 포함된 코드를 기준으로 합니다.",
          headers: {
            code: "코드",
            meaning: "의미",
            note: "비고(리포트 표시)",
          },
          rows: {
            TS: { meaning: "뇌전(Thunderstorm)", note: "코드 포함 일수로 집계" },
            SN: { meaning: "눈(Snow)", note: "코드 포함 일수로 집계" },
            RA: { meaning: "비(Rain)", note: "강수 상황 파악에 참고" },
            FG: { meaning: "안개(Fog)", note: "저시정과 함께 나타날 수 있음" },
            SH: { meaning: "소나기(Shower)", note: "단시간 변동성 큰 강수 신호" },
            FZ: { meaning: "결빙(Freezing)", note: "결빙 위험 상황 해석에 중요" },
            BKN: { meaning: "조각구름(Broken)", note: "운고/운량 해석 시 참고" },
            OVC: { meaning: "전운(Overcast)", note: "저층운 지속 구간 확인에 유용" },
            WS: { meaning: "윈드시어", note: "바람 리스크 판단 시 별도 확인 필요" },
          },
        },
        tips: {
          title: "리포트 활용 팁",
          items: {
            tip1: "기간(포함)을 확인하세요",
            tip2: "평균 지표로 ‘평시 상태’를 파악하세요",
            tip3: "월별 관측 일수로 리스크를 확인하세요",
            tip4: "차트로 추세 변화를 확인하세요",
          },
          warning: "본 리포트는 공개 데이터 기반의 요약 정보입니다. 실제 운항 의사결정에는 공식 기상 브리핑/관제 지시/운항 규정을 함께 확인하세요.",
          faqCtaTitle: "더 궁금한 점이 있나요?",
          faqCtaDescription: "자주 묻는 질문(FAQ)에서 데이터/지표/해석 관련 질문을 확인할 수 있습니다.",
          faqCtaButton: "FAQ로 이동",
        },
      },
      faqPage: {
        seo: {
          title: "자주 묻는 질문(FAQ)",
          description: "공개 리포트/지표/데이터 범위/기술 동작에 대한 자주 묻는 질문을 확인하세요.",
        },
        header: {
          title: "자주 묻는 질문(FAQ)",
          description: "공개 리포트/지표/데이터 범위/기술 동작에 대해 자주 묻는 질문을 정리했습니다.",
          guideButton: "가이드 보기",
          sampleButton: "샘플 리포트 보기",
        },
        filters: {
          searchPlaceholder: "검색: 기간, 커버리지, 임계값, TS/SN ...",
          recommendedLabel: "추천 검색어:",
          count: "표시: {{count}}개",
          empty: "검색 결과가 없습니다.",
        },
        recommendedTerms: {
          toExclusive: "to 미포함",
          periodInclusive: "기간(포함)",
          coverage: "커버리지",
          tsSn: "TS/SN",
          vis800: "저시정 800m",
          wind30: "강풍 30kt",
        },
        categories: {
          all: "전체",
          access: "접근/권한",
          data: "데이터/범위",
          metric: "지표/해석",
          tech: "기술/페이지",
        },
        items: {
          "access-public-report": {
            q: "공개 리포트는 로그인 없이 볼 수 있나요?",
            a: "/report/:icao 같은 공개 페이지는 로그인 없이 열람 가능합니다.",
          },
          "access-csv-download": {
            q: "CSV 다운로드는 가능한가요?",
            a: "현재는 제공 계획이며, 향후 유료 기능으로 제공될 수 있습니다.",
          },
          "data-coverage-meaning": {
            q: "데이터 커버리지는 무엇인가요?",
            a: "선택 기간 내 실제로 관측/저장된 구간(결측 제외)을 의미합니다.",
          },
          "data-inclusive-to-exclusive": {
            q: "기간(포함)과 To(미포함)가 헷갈려요.",
            a: "화면의 ‘기간(포함)’은 실제 포함 범위이며, 내부 조회는 [from, to)로 To는 포함되지 않습니다.",
          },
          "data-global-range": {
            q: "모든 공항 데이터 범위는 어디까지인가요?",
            a: "현재 공개 데이터는 2010-01-01 ~ 2025-12-31 범위 내에서 제공됩니다.",
          },
          "metric-average-vs-days": {
            q: "월별 평균(차트)과 월별 관측 일수(테이블)의 차이는?",
            a: "평균은 ‘평시 상태’ 요약, 관측 일수는 임계값 초과 ‘리스크 빈도’ 비교에 적합합니다.",
          },
          "metric-visibility-threshold": {
            q: "저시정 ≤ 800m는 어떤 의미인가요?",
            a: "해당 기준을 만족한 날의 개수를 월별로 집계합니다.",
          },
          "metric-ts-sn-meaning": {
            q: "TS/SN은 무엇을 의미하나요?",
            a: "METAR 코드로 뇌전(TS)·눈(SN) 등이 포함된 보고서의 빈도를 월별로 집계합니다.",
          },
          "tech-spa-fallback": {
            q: "링크로 바로 들어가면(직접 URL) 페이지가 안 열릴 때가 있어요.",
            a: "SPA 특성상 서버가 index.html fallback을 반환하도록 설정돼야 합니다.",
          },
          "tech-zero-or-dash": {
            q: "값이 0 또는 ‘-’로 보이는 이유는?",
            a: "해당 기간 데이터가 없거나, 조건에 해당하는 이벤트가 없을 수 있습니다.",
          },
        },
      },
      termsPage: {
        seo: {
          title: "이용약관",
          description: "SkyStat 공개 페이지 이용약관",
        },
        header: {
          title: "이용약관",
          description: "SkyStat 공개 리포트와 가이드 이용 시 적용되는 기본 원칙을 안내합니다.",
          guideButton: "가이드",
          sampleButton: "샘플 리포트",
        },
        sections: {
          purpose: {
            title: "서비스 소개 및 목적",
            body: "SkyStat는 공개 리포트/가이드를 통해 METAR 기반 통계 요약 정보를 제공합니다.",
          },
          disclaimer: {
            title: "데이터 및 면책",
            body: "본 서비스의 정보는 참고용 요약이며, 공식 기상 브리핑·관제 지시·운항 규정을 대체하지 않습니다.",
          },
          responsibility: {
            title: "이용자의 책임 및 금지 행위",
            body: "이용자는 서비스 오남용, 과도한 자동 요청, 비정상 접근, 보안 침해 시도를 해서는 안 됩니다.",
          },
          liability: {
            title: "책임 제한",
            body: "공개 리포트는 집계/요약 데이터의 특성상 한계가 있으며, 이를 근거로 한 의사결정의 결과에 대해 서비스 제공자는 법령이 허용하는 범위 내에서 책임이 제한됩니다.",
          },
          changes: {
            title: "약관 변경",
            body: "서비스 정책 또는 운영 방식 변경에 따라 약관은 업데이트될 수 있으며, 변경 내용은 공개 페이지를 통해 공지됩니다.",
          },
          contact: {
            title: "문의",
          },
        },
      },
      privacyPage: {
        seo: {
          title: "개인정보처리방침",
          description: "SkyStat 공개 페이지의 개인정보 및 쿠키/광고 처리 방침 안내",
        },
        header: {
          title: "개인정보처리방침",
          description: "SkyStat 공개 페이지의 개인정보 및 쿠키/광고 처리 방침을 안내합니다.",
          lastUpdated: "최종 업데이트: {{date}}",
          guideButton: "가이드",
          termsButton: "이용약관",
          sampleButton: "샘플 리포트",
        },
        sections: {
          overview: {
            title: "개요",
            body: "SkyStat 공개 리포트/가이드는 METAR 기반 통계 요약을 제공합니다.",
          },
          collect: {
            title: "수집하는 정보",
            body: "서비스 운영 과정에서 IP 주소, 브라우저/기기 정보, 접속 시간, 요청 로그, 오류 로그 등 기술적 정보를 처리할 수 있습니다.",
          },
          purpose: {
            title: "이용 목적",
            body: "수집된 정보는 서비스 안정성 확보, 보안 대응, 품질 개선, 오류 분석, 부정 사용 방지 목적으로 활용됩니다.",
          },
          cookie: {
            title: "쿠키 및 광고 안내",
            body1: "제3자 광고 사업자(예: Google 등)는 쿠키를 사용하여 관심 기반 광고를 제공할 수 있습니다. 사용자는 브라우저 설정 또는 광고 설정을 통해 쿠키 및 맞춤형 광고를 제한할 수 있습니다.",
            body2: "광고 도입 전/후와 관계없이 본 고지 정책은 동일하게 유지됩니다.",
          },
          retention: {
            title: "보관 기간",
            body: "로그 및 기술 정보는 서비스 운영과 보안 점검에 필요한 최소 기간 동안만 보관하며, 목적 달성 후 합리적인 절차에 따라 삭제합니다.",
          },
          contact: {
            title: "문의",
            prefix: "문의:",
            button: "문의 페이지로 이동",
          },
        },
      },
      contactPage: {
        seo: {
          title: "문의하기",
          description: "SkyStat 문의/제휴/정책 관련 연락처",
        },
        header: {
          title: "문의하기",
          description: "리포트 해석, 데이터 범위, 정책/광고 관련 문의를 아래 채널로 보내주세요.",
          guideButton: "가이드 보기",
          termsButton: "이용약관",
          sampleButton: "샘플 리포트 보기",
        },
        sections: {
          channels: {
            title: "문의 채널",
            generalTitle: "일반 문의(리포트/데이터/기능)",
            generalHint: "권장 포함 정보: ICAO / 기간 / 문의 목적",
            policyTitle: "정책/광고/권리 요청",
            policyHint: "권장 포함 정보: 개인정보/쿠키/광고 관련 요청 목적과 대상 페이지",
          },
          template: {
            title: "빠른 문의 템플릿",
            item1: "ICAO 코드 (예: RKSI, KJFK)",
            item2: "조회 기간(From/To) 및 화면의 기간(포함) 표기",
            item3: "확인하고 싶은 지표(평균 시정, 강풍 일수, TS/SN 등)",
            item4: "문제 재현 방법(클릭 순서/입력 값)",
            item5: "스크린샷 또는 오류 메시지(선택)",
          },
          email: {
            title: "이메일 보내기",
            description: "아래 버튼을 누르면 기본 메일 앱에서 바로 문의를 작성할 수 있습니다.",
            button: "ilway5186@gmail.com으로 메일 보내기",
          },
        },
      },
      footer: {
        tagline: "SkyStat 공개 기상 통계",
        about: "About",
        privacy: "개인정보처리방침",
        contact: "문의하기",
        terms: "이용약관",
      },
      aria: {
        openMenu: "메뉴 열기",
      },
      language: {
        label: "언어",
        ko: "한국어",
        en: "English",
        ja: "日本語",
      },
      sidebar: {
        analysisMenu: "분석 메뉴",
        infoPages: "정보 페이지",
      },
    },
  },
  en: {
    translation: {
      nav: {
        about: "About",
        guide: "Guide",
        faq: "FAQ",
        terms: "Terms",
        privacy: "Privacy",
        contact: "Contact",
      },
      actions: {
        home: "Home",
        analyze: "Analyze",
        search: "Search",
        loadingQuery: "Loading...",
        openReport: "Open Report",
        viewGuide: "View Guide",
        viewSampleReport: "View Sample Report",
      },
      labels: {
        icao: "ICAO",
        from: "From (Inclusive)",
        to: "To (Exclusive)",
        airportCode: "Airport code",
      },
      units: {
        records: "records",
      },
      trail: {
        analytics: "Analytics",
        summary: "Summary",
        noData: "No Data",
        error: "Error",
        preview: "Preview",
      },
      dashboard: {
        pageName: "Dashboard",
        coverage: "Data Coverage (Inclusive)",
        guide: {
          title: "Dashboard Guide",
          guideButton: "View Guide",
          sampleButton: "Sample Report",
          bullet1: "Set ICAO and UTC period (From inclusive, To exclusive), then click Search.",
          bullet2: "Lower cards summarize Sample Size / Avg Visibility / Avg Ceiling / Avg Wind.",
          bullet3: "The chart shows monthly average wind-speed trends for the selected period.",
          bullet4: "The table aggregates monthly days that meet threshold conditions.",
        },
        kpi: {
          sectionTitle: "Key Metrics",
          sampleSize: "Sample Size",
          avgVisibility: "Avg Visibility",
          avgCeiling: "Avg Ceiling",
          avgWind: "Avg Wind Speed",
        },
        chart: {
          title: "Mean Wind Speed Trend",
          subtitle: "Monthly average trend for selected period",
        },
        table: {
          title: "Monthly Observed Days",
          subtitle: "Threshold-based monthly day counts",
        },
      },
      reportPage: {
        seo: {
          title: "{{icao}} Report",
          description: "Public weather statistics report page for {{icao}} airport.",
        },
        breadcrumb: {
          report: "Report",
        },
        header: {
          title: "Airport Weather Statistics Report",
          icaoLabel: "ICAO",
          periodInclusive: "Period (Inclusive)",
          coverageInclusive: "Data Coverage (Inclusive)",
          periodToggle: "Change Period",
          copyLink: "Copy Link",
          from: "From",
          to: "To",
          toHint: "The end date (To) is exclusive; data is aggregated up to the day before To.",
          apply: "Apply",
          invalidPeriod: "Please check the selected period.",
          loading: "Loading live data...",
          loadError: "Live data request failed. Example data may be shown instead.",
          presets: {
            recent1y: "Last 1Y",
            recent3y: "Last 3Y",
            recent5y: "Last 5Y",
            all: "All",
            reset: "Reset",
          },
        },
        summary: {
          base: "For the selected inclusive period, average visibility is {{visibility}} and average wind speed is {{wind}}.",
          peak: "Low visibility (≤{{visibility}}m) peaks in {{visMonth}} with {{visDays}} days, and strong wind (peak ≥{{wind}}kt) peaks in {{windMonth}} with {{windDays}} days.",
          coverage: "Data coverage is {{from}}~{{to}}.",
        },
        kpi: {
          sectionTitle: "Observation Overview",
          sampleSize: "Sample Size",
          avgVisibility: "Avg Visibility",
          avgCeiling: "Avg Ceiling",
          avgWind: "Avg Wind Speed",
        },
        chart: {
          windTitle: "Mean Wind Speed Over Time",
          visibilityTitle: "Mean Visibility Over Time",
          subtitle: "Monthly Average (selected period)",
          windSeries: "Wind Speed",
          visibilitySeries: "Visibility",
          note: "Note: Monthly averages summarize baseline conditions. For operational impact, threshold-exceedance days below are more direct.",
        },
        monthly: {
          title: "Monthly Observed Days",
          conditionsLabel: "Aggregation Conditions",
          strongWind: "Strong Wind (Peak)",
          lowVisibility: "Low Visibility",
          lowCeiling: "Low Ceiling",
          thunderstormShort: "TS",
          snowShort: "SN",
          recent12: "Recent 12 Months",
          all: "All",
          displayRecent: "Showing: Recent 12 Months ({{shown}}/{{total}})",
          displayAll: "Showing: All ({{shown}})",
          peakVisibility: "Low visibility (≤{{threshold}}m) max: {{month}} · {{days}} days",
          peakWind: "Strong wind (peak≥{{threshold}}kt) max: {{month}} · {{days}} days",
          noEvent: "No events for the selected conditions",
          noData: "No data available.",
          headers: {
            month: "Month",
            monthSub: "(YYYY-MM)",
            windPeak: "WindPeak",
            windPeakSub: "(≥ {{value}} kt)",
            visibility: "Visibility",
            visibilitySub: "(≤ {{value}} m)",
            ceiling: "Ceiling",
            ceilingSub: "(≤ {{value}} ft)",
            thunderstorm: "Thunderstorm",
            snow: "Snow",
          },
        },
        disclaimer: {
          title: "Disclaimer",
          body: "This report is a statistical summary based on publicly available weather observations. For actual flight operations, always consult official weather briefings and operational regulations.",
        },
        fallback: {
          airportName: "Sample Airport",
          region: "Public Example Data",
          summary: "No predefined data exists for the requested ICAO, so default example values are shown.",
          disclaimer: "Displayed values are example data and must not be used for operational decision-making. Always verify official weather information and operational guidance.",
        },
        toast: {
          copySuccess: "Link copied to clipboard.",
          copyFail: "Copy failed. Please copy the URL manually.",
        },
      },
      analysis: {
        filters: {
          visibilityThreshold: "Visibility Threshold (≤m)",
          windThreshold: "Wind Threshold (≥kt)",
          altimeterThreshold: "Pressure Threshold (≤hPa)",
          weatherCode: "Weather Code",
          weatherCodePlaceholder: "Select code",
        },
        pages: {
          temperature: "Temperature",
          windrose: "Windrose",
        },
        guide: {
          title: "Usage Guide",
          visibility: {
            1: "Set ICAO and UTC period (From inclusive, To exclusive), then enter the visibility threshold (≤ N m) and click Search.",
          },
          wind: {
            1: "Set ICAO and UTC period (From inclusive, To exclusive), then enter the wind threshold (≥ N kt) and click Search.",
          },
          altimeter: {
            1: "Set ICAO and UTC period (From inclusive, To exclusive), then enter the pressure threshold (≤ N hPa) and click Search.",
          },
          weather: {
            1: "Set ICAO and UTC period (From inclusive, To exclusive), choose a weather code (e.g., SN, TS, FG), and click Search.",
            3: "Monthly view shows day counts containing the code, while hourly view shows UTC hourly counts for the selected year/month.",
            5: "You can compare scenarios by changing code or period; all values reflect the selected period and filters.",
          },
          temperature: {
            1: "Set ICAO and UTC period (From inclusive, To exclusive), then click Search.",
            2: "Lower cards summarize sample size, annual mean temperature (℃), and observed max/min temperature (℃).",
            3: "Monthly (graph) shows trends for mean temperature, mean max temperature, and mean min temperature.",
            4: "Hourly (graph) shows UTC hourly mean temperature for the selected year/month.",
            5: "The table lets you review mean temperature and mean max/min temperature by year/month.",
            overline: "Overline labels indicate mean values.",
          },
          windrose: {
            1: "Set ICAO and UTC period (From inclusive, To exclusive), then click Search.",
            2: "The polar chart stacks directional frequency (%) by wind-speed bins (kt), and calm ratio is shown at the center. (Gusts excluded)",
            3: "Current data is aggregated into {{count}} directional bins.",
            4: "You can switch Graph/Table anytime and compare monthly patterns using the month selector.",
            5: "You can compare scenarios by changing period, and all values reflect the selected period and filters.",
          },
          common: {
            2: "Lower cards summarize sample size, observed days, and most frequent month/hour.",
            3: "Monthly view shows days meeting the threshold, and hourly view shows UTC hourly counts for the selected year/month.",
            4: "You can switch Graph/Table anytime and refine results with total/year and month selectors.",
            5: "Adjusting the threshold enables scenario comparison, and all metrics reflect your selected period and threshold.",
          },
        },
        kpi: {
          sectionTitle: "Key Metrics",
          sampleSize: "Sample Size",
          observedDays: "Observed Days",
          mostFrequentMonth: "Most Frequent Month",
          mostFrequentHour: "Most Frequent Hour",
          daysHint: "days",
          monthHint: "month",
          utcAt: "UTC at {{month}}",
          notSearched: "Not Searched",
        },
        monthly: {
          title: "Monthly Observed Days",
        },
        hourly: {
          title: "Hourly Observed Days",
        },
        temperature: {
          kpi: {
            annualMean: "Annual Mean Temp",
            maxTemp: "Max Temp",
            minTemp: "Min Temp",
            temperatureUnitHint: "temperature [℃]",
          },
          chart: {
            legend: {
              meanTMax: "mean T_max",
              meanT: "mean T",
              meanTMin: "mean T_min",
            },
          },
          table: {
            t: "T",
            tMax: "T_max",
            tMin: "T_min",
          },
        },
        windrose: {
          gustHint: "[%] gusts not included",
          monthlyDistTitle: "Monthly Wind Direction/Speed Distribution",
          noData: "No data to display.",
          direction: "Direction",
          kpi: {
            variableRatio: "Variable Wind Ratio",
            speedBins: "Speed Bins",
            directionBins: "Direction Bins",
            levelsHint: "levels",
            cardinalHint: "cardinal",
          },
        },
        common: {
          year: "year",
          month: "Month",
          hour: "Hour",
          count: "Count",
          total: "total",
          totalUpper: "TOTAL",
          graph: "Graph",
          table: "Table",
        },
      },
      home: {
        seo: {
          title: "Airport Weather Statistics Service",
          description: "Public landing page offering METAR-based visibility, ceiling, wind, and weather statistics reports.",
        },
        hero: {
          eyebrow: "SKY WEATHER ANALYTICS",
          title: "Airport Weather Statistics Service",
          body1: "Analyze visibility, ceiling, wind, and weather indicators by airport based on METAR observations.",
          body2: "Set the period and open a report to quickly review patterns for operations and planning.",
        },
        sections: {
          featuresTitle: "What Analyses Are Available?",
          featuresDescription: "Quickly summarize visibility, ceiling, wind, and weather indicators by period.",
          mappingTitle: "Airport METAR Feature Mapping",
          mappingDescription: "Compare visibility, ceiling, wind, and weather data with card-based visual summaries.",
          recommendTitle: "Recommended Airport Reports",
          recommendDescription: "Open frequently viewed airports and compare quickly.",
          coreBadge: "Core",
          airportReportLabel: "Featured report",
          airportSummary: "Visibility · Ceiling · Wind · Weather",
        },
        featureCards: {
          visibility: {
            title: "Visibility",
            description: "Check hourly and monthly visibility distribution at a glance",
            point1: "Identify months with low-visibility concentration",
            point2: "Compare hourly visibility change patterns",
            chip1: "Monthly distribution",
            chip2: "Hourly pattern",
            chip3: "Low-visibility days",
          },
          ceiling: {
            title: "Ceiling",
            description: "Analyze occurrence patterns by low-ceiling bands",
            point1: "Find concentrated low-ceiling bands",
            point2: "Track monthly and hourly low-ceiling trends",
            chip1: "Ceiling bands",
            chip2: "Monthly trend",
            chip3: "Low-ceiling days",
          },
          wind: {
            title: "Wind",
            description: "Analyze wind direction/speed distribution and strong-wind frequency",
            point1: "Compare monthly strong-wind events",
            point2: "Track mean wind-speed trends",
            chip1: "Wind distribution",
            chip2: "Strong-wind events",
            chip3: "Monthly trend",
          },
          weather: {
            title: "Weather Events",
            description: "Summarize occurrence trends for rain, fog, thunder, and more",
            point1: "Aggregate days with TS/SN codes",
            point2: "Check co-occurrence with low visibility",
            chip1: "TS/SN",
            chip2: "Rain/Fog",
            chip3: "Code frequency",
          },
        },
        mappingCards: {
          visCeiling: {
            title: "Visibility/Ceiling Mapping Report",
            description: "Provide monthly and hourly visibility-ceiling distributions in cards.",
          },
          wind: {
            title: "Wind Direction/Speed Mapping Report",
            description: "Compare wind-rose and wind-speed ratio bands in one view.",
          },
          event: {
            title: "Weather Event Mapping",
            description: "Summarize frequency and period of key weather events such as rain, fog, and thunder.",
          },
        },
        preview: {
          monthlyHourly: "Monthly/Hourly",
          windRatio: "Wind-speed ratio",
          rainRun: "Rain sequences",
          lowVisibilityCompanion: "With low visibility",
          eventPeakMonth: "Peak event month",
        },
      },
      aboutPage: {
        seo: {
          title: "About",
          description: "Overview of SkyStat service and public data range",
        },
        header: {
          title: "About SkyStat",
          description: "A brief overview of SkyStat service and public statistical data range.",
          guideButton: "View Guide",
          sampleButton: "Sample Report",
        },
        sections: {
          overview: {
            title: "About SkyStat",
            body: "SkyStat provides public reports summarizing visibility, ceiling, wind, and weather-event statistics based on airport METAR data.",
          },
          range: {
            title: "Data Range",
            prefix: "Public statistical data range is",
            suffix: ".",
          },
          report: {
            title: "Report Structure",
            body: "Reports consist of KPI summary cards, monthly trend charts, and threshold-based monthly observed-day tables.",
          },
          disclaimer: {
            title: "Disclaimer",
            body: "Public statistics are reference summaries and do not replace official weather briefing, ATC instructions, or operational regulations.",
          },
          contact: {
            title: "Contact",
          },
        },
      },
      guidePage: {
        seo: {
          title: "Guide",
          description: "How to interpret key weather metrics and thresholds used in public reports.",
        },
        hero: {
          eyebrow: "GUIDE",
          title: "Guide",
          description: "Learn how to interpret key weather metrics and threshold indicators used in public reports.",
          primaryCta: "Open Monthly Report",
        },
        sectionShortcuts: {
          metrics: "Key Metrics",
          thresholds: "Thresholds",
          tips: "Tips",
        },
        examples: {
          show: "Show example",
          hide: "Hide example",
          label: "Example:",
        },
        metrics: {
          title: "Interpreting Key Metrics",
          subtitle: "These metrics are directly connected to report KPIs/charts/monthly observed-day tables.",
          sampleLink: "Check in Sample Report",
          cards: {
            sampleSize: {
              title: "Sample Size",
              description: "Number of METAR reports used for aggregation in the selected period.",
              tip: "Tip: Interpret averages carefully when sample size is small.",
              example: "Example: If sample size is small (e.g., 2,000), use conservative interpretation.",
            },
            avgVisibility: {
              title: "Avg Visibility (km)",
              description: "Summarizes average visibility level in the selected period (close to normal condition).",
              tip: "Tip: Evaluate risk together with low-visibility threshold exceedance days.",
              example: "Example: 8.8 km looks generally good, but also check low-visibility (≤800 m) days.",
            },
            avgCeiling: {
              title: "Avg Ceiling (ft)",
              description: "Average ceiling level; low-ceiling frequency is more directly shown in threshold indicators below.",
              tip: "Tip: Even with high averages, check concentration of low-ceiling days by month.",
              example: "Example: Even with high average, check monthly concentration of low ceiling (≤300 ft) days.",
            },
            avgWind: {
              title: "Avg Wind Speed (kt)",
              description: "Average wind speed (kt); strong-wind risk should be checked with peak/threshold exceedance days.",
              tip: "Tip: Interpret together with monthly peak wind exceedance days.",
              example: "Example: Even if mean is 7 kt, many strong-wind (peak≥30 kt) days can still impact operations.",
            },
          },
        },
        thresholds: {
          title: "Understanding Thresholds",
          cards: {
            strongWind: {
              title: "Strong Wind (Peak) ≥ 30 kt",
              description: "Aggregates monthly day counts where gust/peak wind speed meets the threshold.",
              example: "Example: 6 days in a month means strong-wind events were frequent in that month.",
            },
            lowVisibility: {
              title: "Low Visibility ≤ 800 m",
              description: "Aggregates monthly day counts meeting the low-visibility threshold.",
              example: "Example: Monthly values like 0-10 days make risk comparison fast.",
            },
            lowCeiling: {
              title: "Low Ceiling ≤ 300 ft",
              description: "Aggregates monthly day counts meeting the low-ceiling threshold.",
              example: "Example: If counts increase in a season, approach/departure operations may be affected.",
            },
            tsSn: {
              title: "TS / SN",
              description: "Aggregates monthly frequency of reports containing METAR codes (Thunderstorm/Snow).",
              example: "Example: TS 2 days, SN 0 days indicates monthly code-inclusion frequency.",
            },
          },
        },
        metar: {
          title: "Quick METAR Code Reference",
          description: "TS/SN and other code counts in reports are based on codes included in original METAR text.",
          headers: {
            code: "Code",
            meaning: "Meaning",
            note: "Note (Report View)",
          },
          rows: {
            TS: { meaning: "Thunderstorm", note: "Counted by days containing the code" },
            SN: { meaning: "Snow", note: "Counted by days containing the code" },
            RA: { meaning: "Rain", note: "Reference for precipitation conditions" },
            FG: { meaning: "Fog", note: "May appear with low visibility" },
            SH: { meaning: "Shower", note: "Short-term high-variability precipitation signal" },
            FZ: { meaning: "Freezing", note: "Important for icing-risk interpretation" },
            BKN: { meaning: "Broken cloud", note: "Reference for ceiling/cloud amount interpretation" },
            OVC: { meaning: "Overcast", note: "Useful for persistent low-cloud period checks" },
            WS: { meaning: "Wind Shear", note: "Requires separate check for wind-risk judgment" },
          },
        },
        tips: {
          title: "Report Usage Tips",
          items: {
            tip1: "Check the inclusive period first",
            tip2: "Understand normal condition via average metrics",
            tip3: "Check risk via monthly observed-day counts",
            tip4: "Confirm trend changes through charts",
          },
          warning: "This report is a public-data-based summary. For operational decisions, always check official weather briefing, ATC instructions, and operation regulations together.",
          faqCtaTitle: "Need more details?",
          faqCtaDescription: "You can find data/metric/interpretation Q&A in FAQ.",
          faqCtaButton: "Go to FAQ",
        },
      },
      faqPage: {
        seo: {
          title: "Frequently Asked Questions (FAQ)",
          description: "Find answers about public reports, metrics, data range, and technical behavior.",
        },
        header: {
          title: "Frequently Asked Questions (FAQ)",
          description: "Common questions about public reports/metrics/data range/technical behavior are collected here.",
          guideButton: "View Guide",
          sampleButton: "View Sample Report",
        },
        filters: {
          searchPlaceholder: "Search: period, coverage, threshold, TS/SN ...",
          recommendedLabel: "Recommended terms:",
          count: "Showing: {{count}}",
          empty: "No results found.",
        },
        recommendedTerms: {
          toExclusive: "to exclusive",
          periodInclusive: "period inclusive",
          coverage: "coverage",
          tsSn: "TS/SN",
          vis800: "visibility 800m",
          wind30: "wind 30kt",
        },
        categories: {
          all: "All",
          access: "Access/Permission",
          data: "Data/Range",
          metric: "Metric/Interpretation",
          tech: "Tech/Page",
        },
        items: {
          "access-public-report": {
            q: "Can I view public reports without login?",
            a: "Public pages such as /report/:icao are available without login.",
          },
          "access-csv-download": {
            q: "Is CSV download available?",
            a: "It is currently planned and may be offered as a paid feature later.",
          },
          "data-coverage-meaning": {
            q: "What is data coverage?",
            a: "It means the actually observed/stored intervals (excluding missing intervals) within the selected period.",
          },
          "data-inclusive-to-exclusive": {
            q: "I am confused about inclusive period and To-exclusive.",
            a: "The displayed 'period (inclusive)' shows included range, while internal query uses [from, to), so To is excluded.",
          },
          "data-global-range": {
            q: "What is the global data range for all airports?",
            a: "Current public data is provided within 2010-01-01 ~ 2025-12-31.",
          },
          "metric-average-vs-days": {
            q: "Difference between monthly averages (chart) and monthly observed days (table)?",
            a: "Averages summarize normal condition, while observed days are better for threshold-exceedance risk frequency comparison.",
          },
          "metric-visibility-threshold": {
            q: "What does low visibility ≤ 800m mean?",
            a: "It aggregates monthly counts of days meeting that threshold.",
          },
          "metric-ts-sn-meaning": {
            q: "What do TS/SN mean?",
            a: "They are METAR codes; monthly frequency is aggregated for reports containing TS (Thunderstorm) and SN (Snow).",
          },
          "tech-spa-fallback": {
            q: "Direct URL open sometimes fails. Why?",
            a: "As an SPA, server must return index.html fallback for direct routes.",
          },
          "tech-zero-or-dash": {
            q: "Why do some values show 0 or '-'?",
            a: "There may be no data in the period or no events meeting the condition.",
          },
        },
      },
      termsPage: {
        seo: {
          title: "Terms",
          description: "Terms of use for SkyStat public pages",
        },
        header: {
          title: "Terms of Use",
          description: "Basic principles applied when using SkyStat public reports and guides.",
          guideButton: "Guide",
          sampleButton: "Sample Report",
        },
        sections: {
          purpose: {
            title: "Service Purpose",
            body: "SkyStat provides METAR-based statistical summaries through public reports/guides.",
          },
          disclaimer: {
            title: "Data and Disclaimer",
            body: "Information is reference-only summary and does not replace official weather briefing, ATC instructions, or operation regulations.",
          },
          responsibility: {
            title: "User Responsibility and Prohibited Actions",
            body: "Users must not abuse the service, send excessive automated requests, attempt abnormal access, or security violations.",
          },
          liability: {
            title: "Limitation of Liability",
            body: "Public reports have inherent limits as aggregated summaries; liability is limited to the extent permitted by applicable laws.",
          },
          changes: {
            title: "Terms Update",
            body: "Terms may be updated due to policy or operational changes, and updates will be announced on public pages.",
          },
          contact: {
            title: "Contact",
          },
        },
      },
      privacyPage: {
        seo: {
          title: "Privacy Policy",
          description: "Privacy, cookie, and advertising policy for SkyStat public pages",
        },
        header: {
          title: "Privacy Policy",
          description: "Guidance on privacy, cookie, and advertising policy for SkyStat public pages.",
          lastUpdated: "Last updated: {{date}}",
          guideButton: "Guide",
          termsButton: "Terms",
          sampleButton: "Sample Report",
        },
        sections: {
          overview: {
            title: "Overview",
            body: "SkyStat public report/guide provides METAR-based statistical summaries.",
          },
          collect: {
            title: "Information Collected",
            body: "During operation, technical information such as IP address, browser/device info, access time, request logs, and error logs may be processed.",
          },
          purpose: {
            title: "Purpose of Use",
            body: "Collected information is used for service stability, security response, quality improvement, error analysis, and abuse prevention.",
          },
          cookie: {
            title: "Cookies and Advertising",
            body1: "Third-party advertising providers (e.g., Google) may use cookies for interest-based ads. Users can restrict cookies and personalized ads via browser/ad settings.",
            body2: "This notice remains in effect both before and after ad introduction.",
          },
          retention: {
            title: "Retention Period",
            body: "Logs and technical information are retained only for the minimum required period and deleted through reasonable procedures afterward.",
          },
          contact: {
            title: "Contact",
            prefix: "Contact:",
            button: "Go to Contact Page",
          },
        },
      },
      contactPage: {
        seo: {
          title: "Contact",
          description: "Contact point for SkyStat inquiries/partnership/policy",
        },
        header: {
          title: "Contact",
          description: "Please use channels below for report interpretation, data range, policy/advertising inquiries.",
          guideButton: "View Guide",
          termsButton: "Terms",
          sampleButton: "View Sample Report",
        },
        sections: {
          channels: {
            title: "Contact Channels",
            generalTitle: "General Inquiry (Report/Data/Feature)",
            generalHint: "Recommended info: ICAO / Period / Inquiry purpose",
            policyTitle: "Policy/Ads/Rights Request",
            policyHint: "Recommended info: purpose and target page for privacy/cookie/ads related request",
          },
          template: {
            title: "Quick Inquiry Template",
            item1: "ICAO code (e.g., RKSI, KJFK)",
            item2: "Query period (From/To) and displayed inclusive period",
            item3: "Target metrics (avg visibility, strong-wind days, TS/SN, etc.)",
            item4: "Reproduction steps (click order/input values)",
            item5: "Screenshot or error message (optional)",
          },
          email: {
            title: "Send Email",
            description: "Click button below to open your default mail app and start writing.",
            button: "Send email to ilway5186@gmail.com",
          },
        },
      },
      footer: {
        tagline: "SkyStat public weather statistics",
        about: "About",
        privacy: "Privacy Policy",
        contact: "Contact",
        terms: "Terms",
      },
      aria: {
        openMenu: "Open menu",
      },
      language: {
        label: "Language",
        ko: "한국어",
        en: "English",
        ja: "日本語",
      },
      sidebar: {
        analysisMenu: "Analysis Menu",
        infoPages: "Info Pages",
      },
    },
  },
  ja: {
    translation: {
      nav: {
        about: "About",
        guide: "Guide",
        faq: "FAQ",
        terms: "Terms",
        privacy: "Privacy",
        contact: "Contact",
      },
      actions: {
        home: "ホーム",
        analyze: "分析へ",
        search: "検索",
        loadingQuery: "読み込み中...",
        openReport: "レポートを開く",
        viewGuide: "ガイドを見る",
        viewSampleReport: "サンプルレポートを見る",
      },
      labels: {
        icao: "ICAO",
        from: "開始日 (From)",
        to: "終了日 (To)",
        airportCode: "空港コード",
      },
      units: {
        records: "件",
      },
      trail: {
        analytics: "Analytics",
        summary: "Summary",
        noData: "No Data",
        error: "Error",
        preview: "Preview",
      },
      dashboard: {
        pageName: "Dashboard",
        coverage: "データカバレッジ (含む)",
        guide: {
          title: "ダッシュボード案内",
          guideButton: "ガイドを見る",
          sampleButton: "サンプルレポート",
          bullet1: "ICAOとUTC期間（From含む、To含まない）を設定して検索してください。",
          bullet2: "下段カードで標本数・平均視程・平均雲底・平均風速を要約します。",
          bullet3: "チャートでは選択期間の月次平均推移を確認できます。",
          bullet4: "テーブルでは閾値条件を満たした月別日数を集計します。",
        },
        kpi: {
          sectionTitle: "主要指標",
          sampleSize: "標本数",
          avgVisibility: "平均視程",
          avgCeiling: "平均雲底",
          avgWind: "平均風速",
        },
        chart: {
          title: "平均風速の時系列",
          subtitle: "選択期間の月次平均トレンド",
        },
        table: {
          title: "月別観測日数",
          subtitle: "閾値基準の月別発生日数集計",
        },
      },
      reportPage: {
        seo: {
          title: "{{icao}} レポート",
          description: "{{icao}} 空港の公開気象統計レポートページです。",
        },
        breadcrumb: {
          report: "レポート",
        },
        header: {
          title: "空港別 気象統計分析レポート",
          icaoLabel: "ICAO",
          periodInclusive: "期間(含む)",
          coverageInclusive: "データカバレッジ(含む)",
          periodToggle: "期間変更",
          copyLink: "リンクをコピー",
          from: "From",
          to: "To",
          toHint: "終了日(To)は含まれず、実際の集計は To の前日までです。",
          apply: "適用",
          invalidPeriod: "期間を確認してください。",
          loading: "実データを読み込み中...",
          loadError: "実データ取得に失敗しました。サンプル値が表示される場合があります。",
          presets: {
            recent1y: "直近1年",
            recent3y: "直近3年",
            recent5y: "直近5年",
            all: "全期間",
            reset: "Reset",
          },
        },
        summary: {
          base: "選択した期間(含む)基準で、平均視程は {{visibility}}、平均風速は {{wind}} です。",
          peak: "低視程(≤{{visibility}}m)は {{visMonth}} に {{visDays}}日で最多、強風(ピーク≥{{wind}}kt)は {{windMonth}} に {{windDays}}日で最多です。",
          coverage: "データカバレッジは {{from}}~{{to}} です。",
        },
        kpi: {
          sectionTitle: "観測状況",
          sampleSize: "標本数",
          avgVisibility: "平均視程",
          avgCeiling: "平均雲底",
          avgWind: "平均風速",
        },
        chart: {
          windTitle: "平均風速 時系列",
          visibilityTitle: "平均視程 時系列",
          subtitle: "Monthly Average (selected period)",
          windSeries: "風速",
          visibilitySeries: "視程",
          note: "参考: 月別平均は平常状態の要約です。運航影響の評価には、下の閾値超過日数の方がより直接的です。",
        },
        monthly: {
          title: "月別観測日数",
          conditionsLabel: "集計条件",
          strongWind: "強風(ピーク)",
          lowVisibility: "低視程",
          lowCeiling: "低雲底",
          thunderstormShort: "雷雨",
          snowShort: "雪",
          recent12: "直近12か月",
          all: "全体",
          displayRecent: "表示: 直近12か月 ({{shown}}/{{total}})",
          displayAll: "表示: 全体 ({{shown}})",
          peakVisibility: "低視程(≤{{threshold}}m) 最多: {{month}} · {{days}}日",
          peakWind: "強風(ピーク≥{{threshold}}kt) 最多: {{month}} · {{days}}日",
          noEvent: "該当条件でイベントはありません",
          noData: "データがありません。",
          headers: {
            month: "Month",
            monthSub: "(YYYY-MM)",
            windPeak: "WindPeak",
            windPeakSub: "(≥ {{value}} kt)",
            visibility: "Visibility",
            visibilitySub: "(≤ {{value}} m)",
            ceiling: "Ceiling",
            ceilingSub: "(≤ {{value}} ft)",
            thunderstorm: "Thunderstorm",
            snow: "Snow",
          },
        },
        disclaimer: {
          title: "免責事項",
          body: "本レポートは公開気象観測データに基づく統計要約です。実際の運航判断では、公式気象ブリーフィングと運航規程を必ず併せて確認してください。",
        },
        fallback: {
          airportName: "サンプル空港",
          region: "公開サンプルデータ",
          summary: "要求された ICAO に事前定義データがないため、既定のサンプル値でレポートを表示します。",
          disclaimer: "表示値はサンプルデータであり、実運航の意思決定には使用できません。公式気象情報と運航手順を確認してください。",
        },
        toast: {
          copySuccess: "リンクをコピーしました。",
          copyFail: "コピーに失敗しました。URLを手動でコピーしてください。",
        },
      },
      analysis: {
        filters: {
          visibilityThreshold: "視程基準(≤m)",
          windThreshold: "風速基準(≥kt)",
          altimeterThreshold: "気圧基準(≤hPa)",
          weatherCode: "現象コード",
          weatherCodePlaceholder: "コード選択",
        },
        pages: {
          temperature: "気温",
          windrose: "ウィンドローズ",
        },
        guide: {
          title: "利用ガイド",
          visibility: {
            1: "ICAOとUTC期間（From含む、To含まない）を設定し、視程基準(≤ N m)を入力して検索してください。",
          },
          wind: {
            1: "ICAOとUTC期間（From含む、To含まない）を設定し、風速基準(≥ N kt)を入力して検索してください。",
          },
          altimeter: {
            1: "ICAOとUTC期間（From含む、To含まない）を設定し、気圧基準(≤ N hPa)を入力して検索してください。",
          },
          weather: {
            1: "ICAOとUTC期間（From含む、To含まない）を設定し、気象コード（例: SN, TS, FG）を選択して検索してください。",
            3: "月別はコードを含む日数、時間帯別は選択した年/月基準のUTC時間帯別発生件数を表示します。",
            5: "コードまたは期間を変更してシナリオ比較ができ、すべての数値は選択した期間とフィルタを反映します。",
          },
          temperature: {
            1: "ICAOとUTC期間（From含む、To含まない）を設定して検索してください。",
            2: "下段カードでは標本数、年平均気温(℃)、観測最高/最低気温(℃)を要約します。",
            3: "月別（グラフ）は平均気温・平均最高気温・平均最低気温の推移を示します。",
            4: "時間帯別（グラフ）は選択した年/月基準のUTC時間帯別平均気温を示します。",
            5: "表では年/月単位で平均気温、平均最高/最低気温を確認できます。",
            overline: "上線表記(overline)は平均値を意味します。",
          },
          windrose: {
            1: "ICAOとUTC期間（From含む、To含まない）を設定して検索してください。",
            2: "極座標チャートは風向別頻度(%)を風速区間(kt)で積み上げ表示し、中央には静穏(Calm)比率を表示します。（突風は除外）",
            3: "現在のデータは{{count}}個の方位区間で集計されています。",
            4: "いつでもグラフ/表の切り替えができ、month選択で月別パターンを比較できます。",
            5: "期間を変更してシナリオ比較ができ、すべての数値は選択した期間とフィルタを反映します。",
          },
          common: {
            2: "下段カードで標本数、観測日数、最頻月/時間を要約します。",
            3: "月別は閾値を満たした日数、時間帯別は選択した年/月基準のUTC時間帯別発生件数を表示します。",
            4: "いつでもグラフ/表の切り替えができ、total/year と month の選択値で結果を細分化できます。",
            5: "基準値を調整するとシナリオ比較が可能で、すべての数値は選択した期間と閾値を反映します。",
          },
        },
        kpi: {
          sectionTitle: "主要指標",
          sampleSize: "標本数",
          observedDays: "観測日数",
          mostFrequentMonth: "最頻月",
          mostFrequentHour: "最頻時間",
          daysHint: "days",
          monthHint: "month",
          utcAt: "UTC at {{month}}",
          notSearched: "未検索",
        },
        monthly: {
          title: "月別観測日数",
        },
        hourly: {
          title: "時間帯別観測日数",
        },
        temperature: {
          kpi: {
            annualMean: "年平均気温",
            maxTemp: "最高気温",
            minTemp: "最低気温",
            temperatureUnitHint: "temperature [℃]",
          },
          chart: {
            legend: {
              meanTMax: "平均 T_max",
              meanT: "平均 T",
              meanTMin: "平均 T_min",
            },
          },
          table: {
            t: "T",
            tMax: "T_max",
            tMin: "T_min",
          },
        },
        windrose: {
          gustHint: "[%] gusts not included",
          monthlyDistTitle: "月別 風向/風速 分布",
          noData: "表示できるデータがありません。",
          direction: "風向",
          kpi: {
            variableRatio: "変風比率",
            speedBins: "風速区間",
            directionBins: "風向区間",
            levelsHint: "区間",
            cardinalHint: "方位",
          },
        },
        common: {
          year: "年",
          month: "月",
          hour: "時刻",
          count: "件数",
          total: "全体",
          totalUpper: "TOTAL",
          graph: "グラフ",
          table: "表",
        },
      },
      home: {
        seo: {
          title: "空港別気象統計分析サービス",
          description: "METARに基づく視程・雲底・風・気象現象の統計レポートを提供する公開ランディングページです。",
        },
        hero: {
          eyebrow: "SKY WEATHER ANALYTICS",
          title: "空港別気象統計分析サービス",
          body1: "METAR観測データを基に、視程・雲底・風・気象現象を空港別に分析します。",
          body2: "期間を指定してレポートを開き、運航・企画に必要な統計パターンを素早く確認できます。",
        },
        sections: {
          featuresTitle: "どのような分析を提供しますか？",
          featuresDescription: "視程・雲底・風・現象指標を期間別に素早く要約します。",
          mappingTitle: "空港別METAR統計分析マッピング",
          mappingDescription: "視程・雲底・風・現象データをカード可視化で素早く比較できます。",
          recommendTitle: "おすすめ空港レポート",
          recommendDescription: "よく参照される空港レポートをすぐに開いて比較できます。",
          coreBadge: "核心",
          airportReportLabel: "代表レポート",
          airportSummary: "視程・雲底・風・現象 要約",
        },
        featureCards: {
          visibility: {
            title: "視程統計",
            description: "時間別・月別の視程分布を素早く確認",
            point1: "低視程発生月を特定",
            point2: "時間帯別の視程変動を比較",
            chip1: "月別分布",
            chip2: "時間パターン",
            chip3: "低視程日数",
          },
          ceiling: {
            title: "雲底統計",
            description: "低雲底区間別の発生傾向を分析",
            point1: "低雲底集中区間を確認",
            point2: "月別・時間別の低雲底推移を把握",
            chip1: "雲底区間",
            chip2: "月別推移",
            chip3: "低雲底日数",
          },
          wind: {
            title: "風統計",
            description: "風向・風速分布と強風頻度を分析",
            point1: "強風イベントの月間頻度比較",
            point2: "平均風速トレンドを確認",
            chip1: "風速分布",
            chip2: "強風イベント",
            chip3: "月別推移",
          },
          weather: {
            title: "現象統計",
            description: "降水・霧・雷など現象発生傾向を整理",
            point1: "TS/SNコード含有日数を集計",
            point2: "低視程同伴現象の有無を確認",
            chip1: "TS/SN",
            chip2: "降水・霧",
            chip3: "コード頻度",
          },
        },
        mappingCards: {
          visCeiling: {
            title: "視程/雲底マッピングレポート",
            description: "月別・時間別の視程-雲底分布をカード形式で提供します。",
          },
          wind: {
            title: "風向/風速マッピングレポート",
            description: "風配図と風速区間比率を1画面で比較できます。",
          },
          event: {
            title: "気象現象イベントマッピング",
            description: "降水・霧・雷など主要現象の頻度と期間を要約します。",
          },
        },
        preview: {
          monthlyHourly: "月別/時間帯",
          windRatio: "風速区間比率",
          rainRun: "降水連続区間",
          lowVisibilityCompanion: "低視程同伴",
          eventPeakMonth: "イベント最多月",
        },
      },
      aboutPage: {
        seo: {
          title: "About",
          description: "SkyStat サービス紹介と公開データ範囲",
        },
        header: {
          title: "About SkyStat",
          description: "SkyStat サービス概要と公開統計データ範囲を簡潔に案内します。",
          guideButton: "ガイドを見る",
          sampleButton: "サンプルレポート",
        },
        sections: {
          overview: {
            title: "SkyStat 概要",
            body: "SkyStat は空港別 METAR データに基づき、視程・雲底・風・気象現象の統計を公開レポートとして提供するサービスです。",
          },
          range: {
            title: "データ範囲",
            prefix: "公開統計基準のデータ範囲は",
            suffix: "です。",
          },
          report: {
            title: "レポート構成",
            body: "レポートは KPI 要約カード、年/月平均トレンドチャート、閾値基準の月別観測日数テーブルで構成されます。",
          },
          disclaimer: {
            title: "免責",
            body: "本サービスの公開統計は参考用要約情報であり、公式ブリーフィング・管制指示・運航規程を代替しません。",
          },
          contact: {
            title: "お問い合わせ",
          },
        },
      },
      guidePage: {
        seo: {
          title: "ガイド",
          description: "公開レポートで使用する主要気象指標と閾値の解釈方法を案内します。",
        },
        hero: {
          eyebrow: "GUIDE",
          title: "ガイド",
          description: "公開レポートで使用する主要気象指標と閾値の解釈方法を案内します。",
          primaryCta: "月次レポートを開く",
        },
        sectionShortcuts: {
          metrics: "主要指標",
          thresholds: "閾値",
          tips: "活用ヒント",
        },
        examples: {
          show: "例を表示",
          hide: "例を非表示",
          label: "例:",
        },
        metrics: {
          title: "主要指標の解釈",
          subtitle: "これらの指標はレポートの KPI/チャート/月別観測日数と連動します。",
          sampleLink: "サンプルレポートで確認",
          cards: {
            sampleSize: {
              title: "標本数(件)",
              description: "選択期間の集計に使用された METAR 報告件数です。",
              tip: "解釈ヒント: 標本数が少ない区間では平均値の解釈に注意してください。",
              example: "例: 標本数が少ない(例: 2,000件)場合は平均値を保守的に解釈します。",
            },
            avgVisibility: {
              title: "平均視程(km)",
              description: "選択期間の平均視程レベルを要約します(平均は平常状態に近い)。",
              tip: "解釈ヒント: リスク評価は低視程閾値超過日数と併せて確認してください。",
              example: "例: 8.8km は概ね良好ですが、低視程(≤800m)日数も確認してください。",
            },
            avgCeiling: {
              title: "平均雲底(ft)",
              description: "雲底平均であり、低雲底頻度は下の閾値指標がより直接的です。",
              tip: "解釈ヒント: 平均が高くても特定月の低雲底集中有無を確認してください。",
              example: "例: 平均が高くても特定月の低雲底(≤300ft)日数集中を確認してください。",
            },
            avgWind: {
              title: "平均風速(kt)",
              description: "平均風速(kt)であり、強風リスクはピーク/閾値超過日数で確認します。",
              tip: "解釈ヒント: 月別ピーク風速超過日数と併せて解釈してください。",
              example: "例: 平均 7kt でも強風(ピーク≥30kt)日数が多いと運航影響が大きくなる可能性があります。",
            },
          },
        },
        thresholds: {
          title: "閾値の説明",
          cards: {
            strongWind: {
              title: "強風(ピーク) ≥ 30kt",
              description: "突風/ピーク風速が基準以上の日数を月別に集計します。",
              example: "例: ある月に 6日なら、その月は強風イベントが頻繁だったことを意味します。",
            },
            lowVisibility: {
              title: "低視程 ≤ 800m",
              description: "低視程基準を満たした日を月別に集計します。",
              example: "例: 月別 0~10日のように日数で集計され、リスク比較が容易です。",
            },
            lowCeiling: {
              title: "低雲底 ≤ 300ft",
              description: "低雲底基準を満たした日を月別に集計します。",
              example: "例: 特定季節に日数が増えると進入/出発運用への影響が大きくなります。",
            },
            tsSn: {
              title: "TS / SN",
              description: "METAR コード(Thunderstorm/Snow)を含む報告を月別に集計します。",
              example: "例: TS 2日、SN 0日のようにコード含有頻度を月別で確認します。",
            },
          },
        },
        metar: {
          title: "METAR コード早見表",
          description: "レポートの TS/SN などコード集計は METAR 原文に含まれるコードを基準にします。",
          headers: {
            code: "コード",
            meaning: "意味",
            note: "備考(レポート表示)",
          },
          rows: {
            TS: { meaning: "雷雨(Thunderstorm)", note: "コード含有日数で集計" },
            SN: { meaning: "雪(Snow)", note: "コード含有日数で集計" },
            RA: { meaning: "雨(Rain)", note: "降水状況把握の参考" },
            FG: { meaning: "霧(Fog)", note: "低視程と同時に現れることがある" },
            SH: { meaning: "にわか雨(Shower)", note: "短時間で変動が大きい降水シグナル" },
            FZ: { meaning: "凍結(Freezing)", note: "着氷リスク解釈に重要" },
            BKN: { meaning: "断雲(Broken)", note: "雲底/雲量解釈の参考" },
            OVC: { meaning: "全天曇(Overcast)", note: "低層雲の持続区間確認に有用" },
            WS: { meaning: "ウィンドシア", note: "風リスク判断時に別途確認が必要" },
          },
        },
        tips: {
          title: "レポート活用ヒント",
          items: {
            tip1: "期間(含む)を確認してください",
            tip2: "平均指標で平常状態を把握してください",
            tip3: "月別観測日数でリスクを確認してください",
            tip4: "チャートでトレンド変化を確認してください",
          },
          warning: "本レポートは公開データに基づく要約情報です。実際の運航判断では公式気象ブリーフィング/管制指示/運航規程を併せて確認してください。",
          faqCtaTitle: "さらに知りたいですか？",
          faqCtaDescription: "FAQ でデータ/指標/解釈に関する質問を確認できます。",
          faqCtaButton: "FAQへ移動",
        },
      },
      faqPage: {
        seo: {
          title: "よくある質問(FAQ)",
          description: "公開レポート/指標/データ範囲/技術動作に関する質問を確認できます。",
        },
        header: {
          title: "よくある質問(FAQ)",
          description: "公開レポート/指標/データ範囲/技術動作に関する質問をまとめました。",
          guideButton: "ガイドを見る",
          sampleButton: "サンプルレポートを見る",
        },
        filters: {
          searchPlaceholder: "検索: 期間, カバレッジ, 閾値, TS/SN ...",
          recommendedLabel: "おすすめ検索語:",
          count: "表示: {{count}}件",
          empty: "検索結果がありません。",
        },
        recommendedTerms: {
          toExclusive: "to 非含む",
          periodInclusive: "期間(含む)",
          coverage: "カバレッジ",
          tsSn: "TS/SN",
          vis800: "低視程 800m",
          wind30: "強風 30kt",
        },
        categories: {
          all: "全体",
          access: "アクセス/権限",
          data: "データ/範囲",
          metric: "指標/解釈",
          tech: "技術/ページ",
        },
        items: {
          "access-public-report": {
            q: "公開レポートはログインなしで見られますか？",
            a: "/report/:icao などの公開ページはログインなしで閲覧できます。",
          },
          "access-csv-download": {
            q: "CSV ダウンロードは可能ですか？",
            a: "現在は提供予定で、今後有料機能として提供される可能性があります。",
          },
          "data-coverage-meaning": {
            q: "データカバレッジとは何ですか？",
            a: "選択期間内で実際に観測/保存された区間(欠測除外)を意味します。",
          },
          "data-inclusive-to-exclusive": {
            q: "期間(含む)と To(非含む)が混乱します。",
            a: "画面の「期間(含む)」は実際の包含範囲で、内部照会は [from, to) のため To は含まれません。",
          },
          "data-global-range": {
            q: "全空港のデータ範囲はどこまでですか？",
            a: "現在の公開データは 2010-01-01 ~ 2025-12-31 範囲で提供されます。",
          },
          "metric-average-vs-days": {
            q: "月別平均(チャート)と月別観測日数(テーブル)の違いは？",
            a: "平均は平常状態の要約、観測日数は閾値超過のリスク頻度比較に適しています。",
          },
          "metric-visibility-threshold": {
            q: "低視程 ≤ 800m は何を意味しますか？",
            a: "その基準を満たした日の件数を月別に集計します。",
          },
          "metric-ts-sn-meaning": {
            q: "TS/SN は何を意味しますか？",
            a: "METAR コードで、TS(雷雨)・SN(雪)を含む報告の頻度を月別に集計します。",
          },
          "tech-spa-fallback": {
            q: "リンクで直接入るとページが開かないことがあります。",
            a: "SPA 特性上、サーバーが index.html fallback を返す設定が必要です。",
          },
          "tech-zero-or-dash": {
            q: "値が 0 または '-' と表示される理由は？",
            a: "該当期間のデータがないか、条件に該当するイベントがない可能性があります。",
          },
        },
      },
      termsPage: {
        seo: {
          title: "利用規約",
          description: "SkyStat 公開ページ利用規約",
        },
        header: {
          title: "利用規約",
          description: "SkyStat 公開レポート/ガイド利用時に適用される基本原則を案内します。",
          guideButton: "ガイド",
          sampleButton: "サンプルレポート",
        },
        sections: {
          purpose: {
            title: "サービス紹介と目的",
            body: "SkyStat は公開レポート/ガイドを通じて METAR 基盤の統計要約情報を提供します。",
          },
          disclaimer: {
            title: "データと免責",
            body: "本サービス情報は参考用要約であり、公式気象ブリーフィング・管制指示・運航規程を代替しません。",
          },
          responsibility: {
            title: "利用者責任と禁止行為",
            body: "利用者はサービス濫用、過度な自動要求、異常アクセス、セキュリティ侵害の試みを行ってはいけません。",
          },
          liability: {
            title: "責任制限",
            body: "公開レポートは集計/要約データ特性上の限界があり、これに基づく意思決定結果に対する責任は法令が許す範囲で制限されます。",
          },
          changes: {
            title: "規約変更",
            body: "サービス方針や運用方式の変更により規約は更新されることがあり、変更内容は公開ページで告知されます。",
          },
          contact: {
            title: "お問い合わせ",
          },
        },
      },
      privacyPage: {
        seo: {
          title: "プライバシーポリシー",
          description: "SkyStat 公開ページの個人情報/クッキー/広告方針",
        },
        header: {
          title: "プライバシーポリシー",
          description: "SkyStat 公開ページの個人情報およびクッキー/広告処理方針を案内します。",
          lastUpdated: "最終更新: {{date}}",
          guideButton: "ガイド",
          termsButton: "利用規約",
          sampleButton: "サンプルレポート",
        },
        sections: {
          overview: {
            title: "概要",
            body: "SkyStat 公開レポート/ガイドは METAR ベース統計要約を提供します。",
          },
          collect: {
            title: "収集する情報",
            body: "サービス運用過程で IP アドレス、ブラウザ/端末情報、接続時刻、リクエストログ、エラーログなど技術情報を処理することがあります。",
          },
          purpose: {
            title: "利用目的",
            body: "収集情報はサービス安定性確保、セキュリティ対応、品質改善、エラー分析、不正利用防止に使用されます。",
          },
          cookie: {
            title: "クッキーおよび広告案内",
            body1: "第三者広告事業者(例: Google 等)はクッキーを使用して関心ベース広告を提供する場合があります。利用者はブラウザ設定や広告設定でクッキー/パーソナライズ広告を制限できます。",
            body2: "広告導入前後に関わらず本通知方針は同様に維持されます。",
          },
          retention: {
            title: "保管期間",
            body: "ログおよび技術情報はサービス運用とセキュリティ点検に必要な最小期間のみ保管し、目的達成後に合理的手続きで削除します。",
          },
          contact: {
            title: "お問い合わせ",
            prefix: "お問い合わせ:",
            button: "お問い合わせページへ移動",
          },
        },
      },
      contactPage: {
        seo: {
          title: "お問い合わせ",
          description: "SkyStat 問い合わせ/提携/方針関連連絡先",
        },
        header: {
          title: "お問い合わせ",
          description: "レポート解釈、データ範囲、方針/広告関連のお問い合わせは以下のチャネルをご利用ください。",
          guideButton: "ガイドを見る",
          termsButton: "利用規約",
          sampleButton: "サンプルレポートを見る",
        },
        sections: {
          channels: {
            title: "問い合わせチャネル",
            generalTitle: "一般問い合わせ(レポート/データ/機能)",
            generalHint: "推奨記載情報: ICAO / 期間 / 問い合わせ目的",
            policyTitle: "方針/広告/権利請求",
            policyHint: "推奨記載情報: 個人情報/クッキー/広告関連の目的と対象ページ",
          },
          template: {
            title: "クイック問い合わせテンプレート",
            item1: "ICAOコード (例: RKSI, KJFK)",
            item2: "照会期間(From/To)および画面の期間(含む)表記",
            item3: "確認したい指標(平均視程、強風日数、TS/SN など)",
            item4: "問題再現手順(クリック順序/入力値)",
            item5: "スクリーンショットまたはエラーメッセージ(任意)",
          },
          email: {
            title: "メール送信",
            description: "下のボタンを押すと既定のメールアプリですぐ問い合わせを作成できます。",
            button: "ilway5186@gmail.com にメール送信",
          },
        },
      },
      footer: {
        tagline: "SkyStat 公開気象統計",
        about: "About",
        privacy: "プライバシー",
        contact: "お問い合わせ",
        terms: "利用規約",
      },
      aria: {
        openMenu: "メニューを開く",
      },
      language: {
        label: "言語",
        ko: "한국어",
        en: "English",
        ja: "日本語",
      },
      sidebar: {
        analysisMenu: "分析メニュー",
        infoPages: "情報ページ",
      },
    },
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ko",
    supportedLngs: ["ko", "en", "ja"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

const setHtmlLang = (lng: string) => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.lang = lng;
};

setHtmlLang((i18n.resolvedLanguage || i18n.language || "ko").split("-")[0]);
i18n.on("languageChanged", (lng) => setHtmlLang(lng.split("-")[0]));

export default i18n;
