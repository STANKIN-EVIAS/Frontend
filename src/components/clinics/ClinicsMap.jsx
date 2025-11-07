import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ClinicsMap = ({ clinics, selectedCoords }) => {
    const navigate = useNavigate();
    const mapRef = useRef(null);

    const center = clinics.length
        ? [clinics[0].latitude || 55.751244, clinics[0].longitude || 37.618423]
        : [55.751244, 37.618423];

    useEffect(() => {
        if (selectedCoords && mapRef.current) {
            mapRef.current.setCenter(selectedCoords, 14, { duration: 300 });
        }
    }, [selectedCoords]);

    return (
        <YMaps query={{ lang: "ru_RU" }}>
            <Map
                instanceRef={(ref) => (mapRef.current = ref)}
                defaultState={{
                    center,
                    zoom: 12,
                    controls: ["zoomControl", "fullscreenControl"],
                }}
                modules={["control.ZoomControl", "control.FullscreenControl"]}
                style={{ width: "100%", height: "100%" }}
            >
                {clinics.map(
                    (clinic) =>
                        clinic.latitude &&
                        clinic.longitude && (
                            <Placemark
                                key={clinic.id}
                                geometry={[clinic.latitude, clinic.longitude]}
                                options={{
                                    iconLayout: "default#image",
                                    iconImageHref: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
                                    iconImageSize: [30, 30],
                                    iconImageOffset: [-15, -30],
                                    cursor: "pointer",
                                }}
                                properties={{
                                    balloonContentHeader: `<strong>${clinic.name}</strong>`,
                                    balloonContentBody: clinic.address,
                                    hintContent: clinic.name,
                                }}
                                onClick={() => navigate(`/clinics/${clinic.id}`)}
                            />
                        )
                )}
            </Map>
        </YMaps>
    );
};

export default ClinicsMap;
