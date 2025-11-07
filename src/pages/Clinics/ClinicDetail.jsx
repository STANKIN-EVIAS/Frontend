import { useClinics } from "components/clinics/useClinics";

const ClinicsPage = () => {
    const { clinics, loading, error } = useClinics();

    if (loading) return <div className="p-6 text-center">Загрузка...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
            <h1 className="text-3xl font-bold mb-8">Ветеринарная клиника</h1>
        </div>
    );
};

export default ClinicsPage;
