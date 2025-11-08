import { useState } from "react";
import ServiceClinicsModal from "./ServiceClinicsModal";
import { useServices } from "./useServices";

const ServicesList = () => {
    const { services, loading, error, search, setSearch } = useServices();
    const [selectedService, setSelectedService] = useState(null);

    if (loading) return <div className="p-6 text-center text-gray-600">Загрузка...</div>;
    if (error) return <div className="p-6 text-center text-red-500 font-semibold">{error}</div>;

    return (
        <div className="p-4">
            <div className="mb-4 flex items-center gap-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по услугам..."
                    className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="text-sm text-gray-600 hover:text-gray-800">
                        Очистить
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 py-10">Ничего не найдено</div>
                ) : (
                    services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.name}</h3>
                                {service.description && (
                                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{service.description}</p>
                                )}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-primary font-bold">
                                    {service.price ? `Цена: ${service.price} ₽` : "По запросу"}
                                </div>
                                <button
                                    onClick={() => setSelectedService(service)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition"
                                >
                                    Показать клиники
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedService && (
                <ServiceClinicsModal service={selectedService} onClose={() => setSelectedService(null)} />
            )}
        </div>
    );
};

export default ServicesList;
