import ClinicsMap from "components/clinics/ClinicsMap";
import { useEffect, useState } from "react";
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getClinicById } from "shared/api/clinics";

const ClinicPage = () => {
    const { id } = useParams();
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClinic = async () => {
            try {
                const data = await getClinicById(id);
                setClinic(data);
            } catch (err) {
                setError("Не удалось загрузить информацию о клинике");
            } finally {
                setLoading(false);
            }
        };
        fetchClinic();
    }, [id]);

    if (loading) return <div className="p-6 text-center text-gray-600">Загрузка...</div>;
    if (error) return <div className="p-6 text-center text-red-500 font-semibold">{error}</div>;
    if (!clinic) return null;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Заголовок */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{clinic.name}</h1>

            {/* Основная информация */}
            <div className="grid md:grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-6">
                <div className="space-y-4">
                    {clinic.address && (
                        <p className="flex items-center gap-2 text-gray-700">
                            <FaMapMarkerAlt className="text-primary" /> {clinic.address}
                        </p>
                    )}
                    {clinic.phone_number && (
                        <p className="flex items-center gap-2 text-gray-700">
                            <FaPhone className="text-primary" /> {clinic.phone_number}
                        </p>
                    )}
                    {clinic.email && (
                        <p className="flex items-center gap-2 text-gray-700">
                            <FaEnvelope className="text-primary" /> {clinic.email}
                        </p>
                    )}
                    {clinic.website && (
                        <p className="flex items-center gap-2 text-gray-700">
                            <FaGlobe className="text-primary" />
                            <a
                                href={clinic.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                {clinic.website}
                            </a>
                        </p>
                    )}
                </div>

                {/* Карта */}
                {clinic.latitude && clinic.longitude && (
                    <div className="w-full h-64 md:h-full rounded-lg overflow-hidden">
                        <ClinicsMap clinics={[clinic]} />
                    </div>
                )}
            </div>

            {/* Описание */}
            {clinic.description && (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Описание клиники</h2>
                    <p className="text-gray-700">{clinic.description}</p>
                </div>
            )}

            {/* Услуги */}
            {clinic.services && clinic.services.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Услуги</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {clinic.services.map((service) => (
                            <span
                                key={service.id}
                                className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {service.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Кнопка записи */}
            <div className="text-center">
                <button className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition">
                    Записаться на прием
                </button>
            </div>
        </div>
    );
};

export default ClinicPage;
