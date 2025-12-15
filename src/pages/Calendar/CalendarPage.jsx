import Calendar from "components/Calendar/Calendar.jsx";
import { useClinics } from "components/Clinics/useClinics";

export default function CalendarPage() {
  const { clinics, loading } = useClinics();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Календарь приёмов</h1>
      {loading ? <p>Загрузка клиник...</p> : <Calendar clinics={clinics} />}
    </div>
  );
}
