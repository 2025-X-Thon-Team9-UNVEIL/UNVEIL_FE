import { useEffect, useRef } from 'react';

const KakaoMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = 'kakao-map-script';

    // 지도를 초기화하고 내 위치에 마커를 찍는 함수
    const initializeMap = () => {
      window.kakao.maps.load(() => {
        if (mapContainer.current) {
          // 1. 기본 지도 생성 (일단 동국대 중심으로 생성)
          const defaultCenter = new window.kakao.maps.LatLng(37.558, 126.9982);
          const options = {
            center: defaultCenter,
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapContainer.current, options);

          // 2. 내 위치 가져오기 (Geolocation)
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude; // 위도
                const lon = position.coords.longitude; // 경도

                const currentPos = new window.kakao.maps.LatLng(lat, lon);

                // 3. 마커 생성 및 표시
                const marker = new window.kakao.maps.Marker({
                  position: currentPos, // 마커 위치
                  map: map, // 지도에 바로 올리기
                });

                // 4. 지도 중심을 부드럽게 이동
                map.panTo(currentPos);
              },
              (err) => {
                console.error('위치 정보를 가져올 수 없습니다.', err);
                // 에러 시 기본 위치(동국대) 유지
              },
            );
          }
        }
      });
    };

    // 스크립트 로드 로직
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.id = scriptId;
      script.async = true;

      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      // 이미 스크립트가 있으면 바로 지도 실행
      if (window.kakao && window.kakao.maps) {
        initializeMap();
      }
    }
  }, []);

  return (
    <>
      <div>카카오맵</div>
      <div ref={mapContainer} className="w-full h-[800px]" />
    </>
  );
};

export default KakaoMap;
