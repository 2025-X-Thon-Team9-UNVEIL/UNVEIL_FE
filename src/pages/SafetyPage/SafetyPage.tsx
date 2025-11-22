import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';

// 데이터
import cctvDataRaw from '@/data/cctvData.json';
import lightDataRaw from '@/data/lightData.json';

type MapData = { id: number; lat: number; lng: number; type: string };
const cctvData = cctvDataRaw as MapData[];
const lightData = lightDataRaw as MapData[];

// 도(degree)를 라디안(radian)으로 바꾸는 헬퍼 함수
const toRadian = (degree: number) => (degree * Math.PI) / 180;
const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const earthRadius = 6371000; // 지구 반지름 (단위: m)

  // 1. 위도/경도를 라디안 단위로 변환
  const lat1Rad = toRadian(lat1);
  const lat2Rad = toRadian(lat2);
  // 2. 두 지점 사이의 차이 (거리)
  const latDiff = toRadian(lat2 - lat1);
  const lngDiff = toRadian(lng2 - lng1);
  // 3. 하버사인 공식 (Haversine Formula) 적용
  // a: 두 지점 사이의 거리의 제곱 반값 (중간 계산값)
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  // c: 각거리 (angular distance)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c; // 최종 거리 (미터)
};

const SafetyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const circlesRef = useRef<any[]>([]);

  const [mapInstance, setMapInstance] = useState<any>(null);
  const [showCCTV, setShowCCTV] = useState(true);
  const [showLight, setShowLight] = useState(true);

  // 1. 고정하고 싶은 주소 설정
  const [address, setAddress] = useState('서울특별시 종로구 인사동5길 20');

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
          const map = new window.kakao.maps.Map(mapContainer.current, options);
          setMapInstance(map);

          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.addressSearch(address, function (result: any, status: any) {
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
  }, []); // 의존성 배열 비움 (한 번만 실행)

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
        });

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

  // 5. 점수 계산 및 이동
  const handleShowDetail = () => {
    if (!targetLocation) return alert('위치 정보를 불러오는 중입니다. 잠시만 기다려주세요.');

    const radius = 100; // 100m 반경

    const nearbyCCTV = cctvData.filter(
      (item) => getDistance(targetLocation.lat, targetLocation.lng, item.lat, item.lng) <= radius,
    ).length;

    const nearbyLights = lightData.filter(
      (item) => getDistance(targetLocation.lat, targetLocation.lng, item.lat, item.lng) <= radius,
    ).length;

    const getGrade = (count: number, type: 'cctv' | 'light') => {
      if (type === 'cctv') {
        if (count >= 10) return 'A';
        if (count >= 6) return 'B';
        if (count >= 3) return 'C';
        if (count >= 1) return 'D';
        return 'F';
      } else {
        if (count >= 30) return 'A';
        if (count >= 20) return 'B';
        if (count >= 10) return 'C';
        if (count >= 5) return 'D';
        return 'F';
      }
    };

    const cctvGrade = getGrade(nearbyCCTV, 'cctv');
    const lightGrade = getGrade(nearbyLights, 'light');

    alert(`
      [${address}] 분석 결과
            
      반경 100m CCTV: ${nearbyCCTV}개 (등급: ${cctvGrade})
      반경 100m 가로등: ${nearbyLights}개 (등급: ${lightGrade})
      
      결과 페이지로 데이터를 넘깁니다.
    `);

    // 실제 이동 코드 (주석 해제 후 사용)
    // navigate('/result', {
    //   state: { address, cctvGrade, lightGrade, cctvCount: nearbyCCTV, lightCount: nearbyLights }
    // });
  };

  return (
    <div className="relative h-screen w-[402px] bg-white overflow-hidden">
      {/* 상단 UI */}
      <div className="absolute top-0 left-0 z-20 w-full pt-12 px-4 pb-4 bg-white">
        <div className="inline-flex h-[45px] w-[355px] items-center justify-center rounded-xl relative mb-4">
          <ArrowLeft className="absolute left-0 text-black cursor-pointer" onClick={() => navigate(-1)} />
          <p className="text-lg font-bold">안전도 분석</p>
        </div>
        <Button className="w-full bg-Semi-Red text-white">{address}</Button>
      </div>

      {/* 하단 UI */}
      <div className="absolute bottom-0 left-0 z-20 w-full px-4 pb-8 pt-4 bg-white">
        <div className="bg-white rounded-2xl p-4 mb-3 text-xs">
          <div className="flex justify-between items-center px-10">
            <div
              onClick={() => setShowCCTV(!showCCTV)}
              className={`flex flex-col items-center gap-1 cursor-pointer ${showCCTV ? 'opacity-100 ' : 'opacity-30 '}`}>
              <div className="w-5 h-5 rounded-full bg-[#2196F3]"></div>
              <span className="font-semibold">CCTV 구역</span>
            </div>

            <div
              onClick={() => setShowLight(!showLight)}
              className={`flex flex-col items-center gap-1 cursor-pointer ${showLight ? 'opacity-100 ' : 'opacity-30 '}`}>
              <div className="w-5 h-5 rounded-full bg-[#FFEE58]"></div>
              <span className="font-semibold">가로등 구역</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-Semi-Red text-white" onClick={handleShowDetail}>
          세부 점수 보러가기
        </Button>
      </div>

      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-10" />
    </div>
  );
};

export default SafetyMap;
