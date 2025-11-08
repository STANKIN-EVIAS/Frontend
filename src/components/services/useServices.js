import { useEffect, useMemo, useState } from "react";
import { getServices } from "shared/api/services";

export const useServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
            } catch {
                setError("Не удалось загрузить услуги");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const filteredServices = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return services;
        return services.filter((s) => {
            const name = (s.name || "").toLowerCase();
            const descr = (s.description || "").toLowerCase();
            return name.includes(q) || descr.includes(q);
        });
    }, [services, search]);

    return { services: filteredServices, loading, error, search, setSearch };
};
