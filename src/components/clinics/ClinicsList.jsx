import { useNavigate } from "react-router-dom";

const ClinicsList = ({ clinics, onShowOnMap }) => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <h2 className="text-2xl font-bold mb-4">Список клиник</h2>

            {clinics.map((clinic) => (
                <div
                    key={clinic.id}
                    className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:bg-gray-100 hover:shadow transition"
                >
                    <div className="cursor-pointer" onClick={() => navigate(`/clinics/${clinic.id}`)}>
                        <h3 className="text-lg font-semibold mb-1">{clinic.name}</h3>
                        <p className="text-gray-600 mb-2">{clinic.address}</p>
                        <p className="text-sm text-gray-500">
                            <span className="font-medium">Телефон:</span> {clinic.phone || "—"}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                            <span className="font-medium">Время работы:</span> {clinic.working_hours || "—"}
                        </p>
                    </div>

                    <button
                        onClick={() => onShowOnMap && onShowOnMap(clinic.latitude, clinic.longitude)}
                        className="mt-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                        Показать на карте
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ClinicsList;
