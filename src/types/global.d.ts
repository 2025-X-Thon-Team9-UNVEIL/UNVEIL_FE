export {};

declare global {
  interface Window {
    kakao: any;
  }

  interface KakaoLatLng {
    getLat: () => number;
    getLng: () => number;
  }

  interface KakaoMap {
    setCenter: (coords: KakaoLatLng) => void;
    getCenter: () => KakaoLatLng;
    getLevel: () => number;
    getBounds: () => KakaoBounds;
  }

  interface KakaoBounds {
    getSouthWest: () => KakaoLatLng;
    getNorthEast: () => KakaoLatLng;
  }

  interface KakaoMarker {
    setMap: (map: KakaoMap | null) => void;
    setPosition: (coords: KakaoLatLng) => void;
  }

  interface AddressSearchResult {
    x: string;
    y: string;
    road_address: {
      address_name: string;
    } | null;
    address: {
      address_name: string;
    };
  }
}
