import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

const KakaoMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null); // 마커를 저장해둘 ref (검색 시 위치 옮기기 위해)

  // 상태 관리
  const [address, setAddress] = useState<string>(''); // 주소 텍스트 (검색어 입력용)
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // 주소 검색 함수 (텍스트 -> 좌표)
  const searchAddress = () => {
    if (!mapInstance || !address) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function (result: any, status: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

        // 1. 지도 중심 이동
        mapInstance.setCenter(coords);

        // 2. 마커 위치 이동
        if (markerRef.current) {
          markerRef.current.setPosition(coords);
        }
      } else {
        alert('검색 결과가 없습니다. 도로명이나 지번 주소를 정확히 입력해주세요.');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  useEffect(() => {
    const scriptId = 'kakao-map-script';

    const initializeMap = () => {
      window.kakao.maps.load(() => {
        if (mapContainer.current) {
          const defaultCenter = new window.kakao.maps.LatLng(37.558, 126.9982); // 동국대
          const options = { center: defaultCenter, level: 3 };
          const map = new window.kakao.maps.Map(mapContainer.current, options);
          setMapInstance(map);

          const geocoder = new window.kakao.maps.services.Geocoder();

          // 마커
          const marker = new window.kakao.maps.Marker({ position: defaultCenter, map: map });
          markerRef.current = marker;

          const searchDetailAddrFromCoords = (coords: any, callback: any) => {
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
          };

          // 지도 중심 변경(드래그) 시 주소 업데이트
          window.kakao.maps.event.addListener(map, 'idle', function () {
            searchDetailAddrFromCoords(map.getCenter(), function (result: any, status: any) {
              if (status === window.kakao.maps.services.Status.OK) {
                const detailAddr = result[0].road_address
                  ? result[0].road_address.address_name
                  : result[0].address.address_name;

                // 사용자가 검색 중이 아닐 때만(드래그로 이동했을 때만) 주소창 업데이트
                // (이 부분이 없으면 타자 칠 때마다 주소가 덮어씌워질 수 있음, 필요에 따라 조정)
                setAddress(detailAddr);

                // 마커도 지도 중심으로 따라오게 하려면:
                marker.setPosition(map.getCenter());
              }
            });
          });

          // 초기 내 위치 가져오기
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              const currentPos = new window.kakao.maps.LatLng(lat, lon);

              map.panTo(currentPos);
              marker.setPosition(currentPos);

              searchDetailAddrFromCoords(currentPos, (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const detailAddr = result[0].road_address
                    ? result[0].road_address.address_name
                    : result[0].address.address_name;
                  setAddress(detailAddr);
                }
              });
            });
          }
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
      if (window.kakao && window.kakao.maps) {
        initializeMap();
      }
    }
  }, []);

  // 버튼 핸들러
  const handleRegister = () => {
    if (!address) return alert('주소를 입력해주세요.');
    setIsRegistered(true);
  };

  const handleRetry = () => {
    setIsRegistered(false);
  };

  const handleNext = () => {
    alert(`"${address}" 위치로 설정을 완료합니다!`);
  };

  return (
    <div className="relative h-screen w-[402px]">
      <div className="absolute top-0 left-0 z-20 w-full bg-white px-6 pt-12 pb-8 flex flex-col gap-4">
        <div className="relative">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-[50px] pl-5 pr-10"
            placeholder="위치 등록"
          />

          <Search
            onClick={searchAddress}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            size={20}
          />
        </div>

        {!isRegistered ? (
          <Button onClick={handleRegister} className="h-11 w-full bg-Semi-Red">
            위치 등록하기
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleRetry} className="flex-1 bg-Semi-Red h-11">
              다시 등록하기
            </Button>
            <Button onClick={handleNext} className="flex-1 bg-Semi-Red text-white">
              다음으로 넘어가기
            </Button>
          </div>
        )}
      </div>

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default KakaoMap;
