import ClinicsList from "components/Clinics/ClinicsList";
import ClinicsMap from "components/Clinics/ClinicsMap";
import { useClinics } from "components/Clinics/useClinics";
import { useState } from "react";

const ClinicsPage = () => {
    const { clinics, loading, error } = useClinics();
    const [selectedCoords, setSelectedCoords] = useState(null);

    if (loading) return <div className="p-6 text-center">Загрузка...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Ветеринарные клиники</h1>

            <div className="flex flex-col md:flex-row gap-6 relative">
                {/* Список клиник */}
                <div className="w-full md:w-[40%] bg-white rounded-2xl shadow-md overflow-auto max-h-[500px] z-10 relative">
                    <ClinicsList clinics={clinics} onShowOnMap={(lat, lon) => setSelectedCoords([lat, lon])} />
                </div>

                {/* Карта */}
                <div className="w-full md:flex-1 bg-white rounded-2xl shadow-md h-[500px] overflow-hidden relative z-0">
                    <ClinicsMap clinics={clinics} selectedCoords={selectedCoords} />
                </div>
            </div>
        </div>
    );
};

export default ClinicsPage;
