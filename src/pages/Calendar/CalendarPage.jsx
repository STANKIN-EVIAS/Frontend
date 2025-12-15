import Calendar from "components/Calendar/Calendar.jsx";
import { useClinics } from "components/Clinics/useClinics";

export default function CalendarPage() {
  const { clinics, loading } = useClinics();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Календарь приёмов</h1>
      {loading ? <p>Загрузка клиник...</p> : <Calendar clinics={clinics} />}
    </div>
  );
}
