import { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

interface PlacePickerModalProps {
  onClose: () => void;
  onSelect: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  initialLatLng?: { lat: number; lng: number };
}

const PlacePickerModal = ({ onClose, onSelect, initialLatLng }: PlacePickerModalProps) => {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBUIRKuDhxD_Q0JaJmH_msG5_iOzb9AL_Y",
    libraries: ["places"],
  });

  useEffect(() => {
    if (initialLatLng) {
      setCenter(initialLatLng);
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const getAddress = async (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const res = await geocoder.geocode({ location: { lat, lng }, language: "ko" });

    const raw = res.results[0]?.formatted_address || "";

    return raw.startsWith("대한민국 ") ? raw.replace("대한민국 ", "") : raw;
  };

  const isWithinKorea = (lat: number, lng: number) => {
    return (
      lat >= 33.0 && lat <= 38.4 &&
      lng >= 124.1 && lng <= 131.6
    )
  }

  const handleConfirm = async () => {
    const center = mapRef.current?.getCenter();
    if (!center) {
        alert("지도를 아직 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
        return;
    }

    const { lat, lng } = center.toJSON();

    if (!isWithinKorea(lat, lng)) {
      alert("대한민국 내 위치만 선택할 수 있습니다.");
      return;
    }

    try {
        const address = await getAddress(lat, lng);
        onSelect({ lat, lng, address });
        onClose();
    } catch (err) {
        console.error("주소 변환 실패:", err);
        alert("주소를 불러오는 데 실패했습니다.");
    }
  };

  if (!isLoaded) return <div className="p-4">지도를 불러오는 중입니다...</div>;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex-1 relative">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={(map) => {mapRef.current = map}}
          options={{
            disableDefaultUI: true,
            restriction: {
              latLngBounds: {
                north: 38.3447,
                south: 33.0642,
                west: 124.1050,
                east: 131.5223,
              },
              strictBounds: true,
            },
          }}
        />
        {/* 고정된 중앙 마커 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10">
          <img
            src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            alt="center marker"
            className="w-8 h-8"
          />
        </div>
      </div>

      <div className="p-4">
        <button
          className="bg-black text-white w-full py-3 rounded-xl"
          onClick={handleConfirm}
          type="button"
        >
          이 위치로 선택
        </button>
        <button
          className="mt-2 text-center w-full text-gray-500"
          onClick={onClose}
          type="button"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default PlacePickerModal;
