import { useEffect, useState } from "react";
import { getClinics } from "shared/api/clinics";

export const useClinics = () => {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const data = await getClinics();
                setClinics(data);
            } catch {
                setError("Не удалось загрузить список клиник");
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, []);

    return { clinics, loading, error };
};
