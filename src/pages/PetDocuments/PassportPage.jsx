import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPetPassport } from "shared/api/passports";

const passportPlaceholder = "/assets/pet-placeholder.avif";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
}

function PassportRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 py-3 border-b border-gray-100 last:border-0">
      <div className="w-full sm:w-1/3 text-gray-500 text-sm font-medium">
        {label}
      </div>
      <div className="w-full sm:w-2/3 text-gray-800 text-sm">
        {value || "—"}
      </div>
    </div>
  );
}

export default function PassportPage() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPassport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPetPassport(petId);
      setPassport(data);
    } catch (e) {
      console.error(e);
      setError("Паспорт питомца не найден");
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchPassport();
  }, [fetchPassport]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Загрузка паспорта...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(`/pet/${petId}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Назад */}
        <button
          onClick={() => navigate(`/pet/${petId}`)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Назад к питомцу
        </button>

        {/* Карточка паспорта */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Фото */}
            <div className="w-full sm:w-1/3 flex justify-center">
              <img
                src={passport.photo || passportPlaceholder}
                alt="Паспорт питомца"
                className="w-48 h-48 object-cover rounded-xl border"
              />
            </div>

            {/* Данные */}
            <div className="w-full sm:w-2/3">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Паспорт питомца
              </h1>
              <p className="text-gray-500 mb-6">
                № {passport.passport_number}
              </p>

              <PassportRow label="Имя питомца" value={passport.pet_name} />
              <PassportRow label="Порода" value={passport.pet_species} />
              <PassportRow
                label="Дата выдачи"
                value={formatDate(passport.issue_date)}
              />
              <PassportRow label="Кем выдан" value={passport.issued_by} />
              <PassportRow label="Страна выдачи" value={passport.country_of_issue} />
              <PassportRow
                label="Номер микрочипа"
                value={passport.microchip_number}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
