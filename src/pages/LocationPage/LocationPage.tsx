import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useEffect, useRef, useState } from 'react';
import Footer from '@/components/Footer';
import Txt from '@/components/atoms/Text';
import { useNavigate } from 'react-router-dom';

const LocationPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null); // 마커를 저장해둘 ref (검색 시 위치 옮기기 위해)

  const navigate = useNavigate();

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

  // 주소 보내기
  const handleNext = () => {
    navigate('/safety', {
      state: { address: address },
    });
  };

  return (
    <div className="w-[341px] flex min-h-screen flex-col bg-white">
      {/* 로고 */}
      <div className="flex items-center gap-2 pt-15">
        <img src="/icons/logo.svg" alt="로고" className="w-30" />
      </div>
      <Txt weight="bold" className="text-base mt-4 mb-8 text-left">
        보이지 않던 자취 리스크,
        <br />
        이제는 미리 보고 고르세요.
      </Txt>
      <div className="w-full flex flex-col gap-4 ">
        <div className="relative">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-[50px] pl-5 pr-10"
            placeholder="위치 등록"
          />

          <button onClick={searchAddress} className="absolute right-4 top-1/2 -translate-y-1/2">
            <img src="/icons/search.svg" alt="검색" />
          </button>
        </div>

        {!isRegistered ? (
          <Button onClick={handleRegister} className="h-11 w-full bg-Semi-Red mb-[24px]">
            <Txt className="text-white" weight="semibold">
              위치 등록하기
            </Txt>
          </Button>
        ) : (
          <div className="flex gap-2 mb-[24px]">
            <Button onClick={handleRetry} className="flex-1 bg-Semi-Red h-11 ">
              <Txt className="text-white" weight="semibold">
                다시 등록하기
              </Txt>
            </Button>
            <Button onClick={handleNext} className="flex-1 bg-Semi-Red text-white">
              <Txt className="text-white" weight="semibold">
                다음으로 넘어가기
              </Txt>
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 relative w-full">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      </div>
      <Footer />
    </div>
  );
};

export default LocationPage;
