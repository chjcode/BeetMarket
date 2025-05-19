import { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  OverlayView,
  Marker,
} from "@react-google-maps/api";
import { ProductItemProps } from "@/shared/types/product";
import { dummyProducts } from "@/shared/dummy/products";

const MapPage = () => {
  const [products, setProducts] = useState<ProductItemProps[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter({ lat, lng });
        setMyLocation({ lat, lng });
        setProducts(dummyProducts);
      },
      () => {
        setCenter({ lat: 37.5665, lng: 126.978 });
        setProducts(dummyProducts);
      }
    );
  }, []);

  const handleMapClick = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div className="h-[calc(100dvh-110px)]"> {/* 뷰포트 전체 고정 */}
      <LoadScript googleMapsApiKey="AIzaSyBUIRKuDhxD_Q0JaJmH_msG5_iOzb9AL_Y">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={14}
          onClick={handleMapClick}
          options={{disableDefaultUI: true}}
        >
          {/* ✅ 내 위치 마커 */}
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
                    setSelected(product.id);
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
      </LoadScript>
    </div>
  );
};

export default MapPage;
