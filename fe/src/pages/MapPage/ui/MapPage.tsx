import { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
  Marker,
} from "@react-google-maps/api";
import { ProductItemProps } from "@/shared/types/product";
import { dummyProducts } from "@/shared/dummy/products";
import { getNearbyProducts } from "@/shared/api/mapApi";
import { useNavigate } from "react-router-dom";

const getRegionFromLatLng = async (lat: number, lng: number): Promise<string | null> => {
  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== "OK" || !results || results.length === 0) {
        resolve(null);
        return;
      }

      let regionName: string | null = null;

      for (const result of results) {
        const component = result.address_components.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        );

        if (component && /[가-힣]/.test(component.long_name)) {
          regionName = component.long_name;
          break;
        }
      }

      if (!regionName) {
        resolve(null);
        return;
      }

      const regionMap: Record<string, string> = {
        "서울특별시": "서울",
        "부산광역시": "부산",
        "대구광역시": "대구",
        "인천광역시": "인천",
        "광주광역시": "광주",
        "대전광역시": "대전",
        "울산광역시": "울산",
        "세종특별자치시": "세종",
        "경기도": "경기",
        "강원도": "강원",
        "충청북도": "충북",
        "충청남도": "충남",
        "전라북도": "전북",
        "전라남도": "전남",
        "경상북도": "경북",
        "경상남도": "경남",
        "제주특별자치도": "제주",
      };

      resolve(regionMap[regionName] || null);
    });
  });
};

const MapPage = () => {
  const [products, setProducts] = useState<ProductItemProps[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBUIRKuDhxD_Q0JaJmH_msG5_iOzb9AL_Y",
  });

  useEffect(() => {
    if (!isLoaded) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCenter({ lat, lng });
        setMyLocation({ lat, lng });

        const region = await getRegionFromLatLng(lat, lng);
        console.log("추출된 region 값:", region);

        if (region) {
          const data = await getNearbyProducts(region);
          console.log("서버 응답 데이터:", data);
          setProducts(data);
        } else {
          setProducts([]); // fallback
        }
      },
      () => {
        setCenter({ lat: 37.5665, lng: 126.978 });
        setProducts(dummyProducts);
      }
    );
  }, [isLoaded]);

  const handleMapClick = useCallback(() => {
    setSelected(null);
  }, []);

  if (!isLoaded) return <div>지도를 불러오는 중...</div>;

  return (
    <div className="h-[calc(100dvh-110px)]"> {/* 뷰포트 전체 고정 */}
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={12}
          onClick={handleMapClick}
          options={{
            disableDefaultUI: true,
            restriction: {
              latLngBounds: {
                north: 38.6,
                south: 33.0642,
                west: 124.1050,
                east: 131.5223,
              },
              strictBounds: true,
            },
          }}
        >
          {/* 내 위치 마커 */}
          {myLocation && (
            <Marker
              position={myLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#EE1414",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
              }}
            />
          )}

          {products.map((product) => {
            const isSelected = selected === product.id;
            return (
              <OverlayView
                key={product.id}
                position={{ lat: product.latitude, lng: product.longitude }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected) {
                      navigate(`/product/${product.id}`);
                    } else {
                      setSelected(product.id);
                    }
                  }}
                  style={{ transform: "translate(-50%, -100%)" }}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected ? "z-[1000]" : "z-[10]"
                  }`}
                >
                  {isSelected ? (
                    <div className="max-w-[240px] w-[90vw] rounded-2xl bg-white shadow-xl p-2">
                      <img
                        src={product.thumbnailUrl}
                        alt={product.title}
                        className="w-full h-[120px] object-cover rounded-xl"
                      />
                      <div className="mt-2 font-semibold text-sm">
                        {product.title}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {product.price.toLocaleString()}원
                      </div>
                    </div>
                  ) : (
                    <div className="w-[64px] h-[64px] rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                      <img
                        src={product.thumbnailUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </OverlayView>
            );
          })}
        </GoogleMap>
    </div>
  );
};

export default MapPage;
