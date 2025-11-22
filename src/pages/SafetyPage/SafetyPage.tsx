import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Text';

// 데이터
import cctvDataRaw from '@/data/cctvData.json';
import lightDataRaw from '@/data/lightData.json';
import SafetyScoreCard from './components/SafetyScoreCard';
import { useSafetyMeasurement } from './hooks/useSafetyMeasurement';

type MapData = { id: number; lat: number; lng: number; type: string };
const cctvData = cctvDataRaw as MapData[];
const lightData = lightDataRaw as MapData[];

// Kakao Maps API 타입 정의
type KakaoMap = {
  getLevel: () => number;
  getBounds: () => {
    getSouthWest: () => { getLat: () => number; getLng: () => number };
    getNorthEast: () => { getLat: () => number; getLng: () => number };
  };
  setCenter: (latlng: LatLng) => void;
};

type KakaoCircle = {
  setMap: (map: KakaoMap | null) => void;
};

type LatLng = {
  getLat: () => number;
  getLng: () => number;
};

type GeocoderResult = Array<{ y: string; x: string }>;
type GeocoderStatus = (typeof window.kakao.maps.services.Status)[keyof typeof window.kakao.maps.services.Status];

const SafetyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const circlesRef = useRef<KakaoCircle[]>([]);

  const [mapInstance, setMapInstance] = useState<KakaoMap | null>(null);
  const [showCCTV, setShowCCTV] = useState(true);
  const [showLight, setShowLight] = useState(true);
  const [showScore, setShowScore] = useState(false);
  const [lightGrade, setLightGrade] = useState<string>('');
  const [cctvGrade, setCctvGrade] = useState<string>('');

  // 1. LocationPage에서 전달받은 주소 또는 기본값
  const address = (location.state as { address?: string } | null)?.address || '서울특별시 종로구 인사동5길 20';
  // 2. [변경] targetLocation을 상태(State)로 변경 (초기값은 null 또는 기본값)
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 3. 지도 초기화 및 주소 검색
  useEffect(() => {
    const scriptId = 'kakao-map-script';

    const initializeMap = () => {
      window.kakao.maps.load(() => {
        if (mapContainer.current) {
          // 일단 기본 위치로 지도 생성 (나중에 주소 검색 후 이동됨)
          const defaultCenter = new window.kakao.maps.LatLng(37.558, 126.9982);
          const options = {
            center: defaultCenter,
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapContainer.current, options) as KakaoMap;
          setMapInstance(map);

          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.addressSearch(address, function (result: GeocoderResult, status: GeocoderStatus) {
            if (status === window.kakao.maps.services.Status.OK) {
              const newCoords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

              // 지도 중심 이동
              map.setCenter(newCoords);

              // 마커나 핀을 하나 찍어줘도 좋음 (현재 위치 표시)
              new window.kakao.maps.Marker({
                map: map,
                position: newCoords,
              });

              // 점수 계산을 위한 기준 좌표 업데이트
              setTargetLocation({
                lat: parseFloat(result[0].y),
                lng: parseFloat(result[0].x),
              });
            }
          });
        }
      });
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
      script.id = scriptId;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      if (window.kakao && window.kakao.maps) initializeMap();
    }
  }, [address]); // address가 변경되면 지도 업데이트

  // 4. 안전 구역 렌더링 (targetLocation이 업데이트되면 다시 그려질 수도 있음)
  useEffect(() => {
    if (!mapInstance) return;

    const renderSafetyZones = () => {
      circlesRef.current.forEach((circle) => circle.setMap(null));
      circlesRef.current = [];

      const level = mapInstance.getLevel();
      if (level > 5) return;

      const bounds = mapInstance.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const isInside = (lat: number, lng: number) => {
        return lat >= sw.getLat() && lat <= ne.getLat() && lng >= sw.getLng() && lng <= ne.getLng();
      };

      const addCircle = (lat: number, lng: number, type: 'cctv' | 'light') => {
        const isCCTV = type === 'cctv';
        const color = isCCTV ? '#2196F3' : '#FFEE58';
        const radius = isCCTV ? 30 : 15;

        const circle = new window.kakao.maps.Circle({
          center: new window.kakao.maps.LatLng(lat, lng),
          radius: radius,
          strokeWeight: 0,
          fillColor: color,
          fillOpacity: 0.5,
        }) as KakaoCircle;

        circle.setMap(mapInstance);
        circlesRef.current.push(circle);
      };

      if (showCCTV) {
        cctvData.forEach((item) => {
          if (isInside(item.lat, item.lng)) addCircle(item.lat, item.lng, 'cctv');
        });
      }

      if (showLight) {
        lightData.forEach((item) => {
          if (isInside(item.lat, item.lng)) addCircle(item.lat, item.lng, 'light');
        });
      }
    };

    renderSafetyZones();

    const listener = () => renderSafetyZones();
    window.kakao.maps.event.addListener(mapInstance, 'idle', listener);

    return () => {
      window.kakao.maps.event.removeListener(mapInstance, 'idle', listener);
    };
  }, [mapInstance, showCCTV, showLight, targetLocation]); // targetLocation이 잡히면 다시 그릴 수 있도록 추가

  // 안전도 측정 결과
  const measurementResult = useSafetyMeasurement(targetLocation, 100);

  // 5. 점수 계산 및 이동
  const handleShowDetail = () => {
    if (!targetLocation) return alert('위치 정보를 불러오는 중입니다. 잠시만 기다려주세요.');

    // 결과 상태 업데이트
    setCctvGrade(measurementResult.cctvGrade);
    setLightGrade(measurementResult.lightGrade);
    setShowScore(true);
  };

  return (
    <div className="relative h-screen w-[402px] bg-white overflow-hidden">
      {/* 상단 UI */}
      <header className="fixed top-0 left-0 right-0 z-20 w-full bg-white">
        <div className="relative flex h-[56px] items-center justify-center">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-4 flex items-center">
            <img src="/icons/back.svg" alt="뒤로가기" className="w-3" />
          </button>
          <Txt className="text-xl">측정 목록</Txt>
        </div>
      </header>

      {/* 주소 표시 */}
      <div className="fixed top-[56px] left-0 right-0 z-20 w-full px-4 pt-4 bg-white">
        <Button className="w-full bg-button-pink border border-semi-red text-white">{address}</Button>
      </div>

      {/* 하단 UI */}
      <div className="fixed bottom-0 left-0 z-20 w-full px-4 pb-8 pt-2 bg-white">
        {!showScore && (
          <div className="bg-white rounded-2xl p-4 mb-3 text-xs">
            <div className="flex justify-between items-center px-10">
              <div
                onClick={() => setShowCCTV(!showCCTV)}
                className={`flex flex-col items-center gap-1 cursor-pointer ${showCCTV ? 'opacity-100 ' : 'opacity-30 '}`}>
                <div className="w-5 h-5 rounded-full bg-[#2196F3]"></div>
                <Txt className="text-sm">CCTV 구역</Txt>
              </div>

              <div
                onClick={() => setShowLight(!showLight)}
                className={`flex flex-col items-center gap-1 cursor-pointer ${showLight ? 'opacity-100 ' : 'opacity-30 '}`}>
                <div className="w-5 h-5 rounded-full bg-[#FFEE58]"></div>
                <Txt className="text-sm">가로등 구역</Txt>
              </div>
            </div>
          </div>
        )}

        {/* 버튼 위치에 카드 또는 버튼 표시 - 같은 위치에 나타나도록 */}
        <div className="relative">
          {!showScore ? (
            <Button className="w-full bg-Semi-Red text-white" onClick={handleShowDetail}>
              세부 점수 보기
            </Button>
          ) : (
            <div className="w-full">
              <SafetyScoreCard lightGrade={lightGrade} cctvGrade={cctvGrade} />
              <Button
                className="w-full bg-Semi-Red text-white mt-4"
                onClick={() => {
                  // 다음 페이지로 이동
                  navigate('/result', {
                    state: { address, cctvGrade, lightGrade },
                  });
                }}>
                최종 결과 보기
              </Button>
            </div>
          )}
        </div>
      </div>

      <div ref={mapContainer} className="absolute top-[120px] left-0 right-0 bottom-[180px] w-full z-10" />
    </div>
  );
};

export default SafetyMap;
