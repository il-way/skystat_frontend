import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

export default function RouteTracker() {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // 1. 구글 애널리틱스 초기화 (한 번만 실행)
  useEffect(() => {
    // 본인의 측정 ID를 입력하세요 (환경변수로 빼는 것을 추천)
    const GA_ID = import.meta.env.VITE_GA_ID;
    
    if (GA_ID) {
      ReactGA.initialize(GA_ID);
      setInitialized(true);
    }
  }, []);

  // 2. 페이지 경로가 바뀔 때마다 실행
  useEffect(() => {
    if (initialized) {
      // 현재 주소(pathname)를 구글로 전송
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [initialized, location]);

  return null; // 화면에 그릴 것은 없음
};