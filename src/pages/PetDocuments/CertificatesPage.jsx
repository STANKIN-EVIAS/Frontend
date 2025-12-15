import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPet } from "shared/api/pets";
import { getPetCertificates } from "shared/api/certificates";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
}

function CertificateItem({ certificate }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {certificate.title}
          </h3>
          <p className="text-sm text-gray-500">
            {certificate.certificate_type_display}
          </p>
        </div>

        <span className="text-sm text-gray-400">
          № {certificate.certificate_number}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Дата выдачи</p>
          <p className="text-gray-800">{formatDate(certificate.issue_date)}</p>
        </div>

        <div>
          <p className="text-gray-500">Срок действия</p>
          <p className="text-gray-800">
            {certificate.expiration_date
              ? formatDate(certificate.expiration_date)
              : "Бессрочно"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Кем выдан</p>
          <p className="text-gray-800">{certificate.issued_by || "—"}</p>
        </div>

        {certificate.pet_name && (
          <div>
            <p className="text-gray-500">Питомец</p>
            <p className="text-gray-800">{certificate.pet_name}</p>
          </div>
        )}
      </div>

      {certificate.description && (
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Описание</p>
          <p className="text-gray-800 text-sm">{certificate.description}</p>
        </div>
      )}
    </div>
  );
}

export default function CertificatesPage() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const petData = await getPet(petId);
      setPet(petData);

      const certs = await getPetCertificates(petId);
      setCertificates(certs || []);
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить сертификаты");
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Загрузка сертификатов...
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
      <div className="max-w-5xl mx-auto">
        {/* Назад */}
        <button
          onClick={() => navigate(`/pet/${petId}`)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Назад к питомцу
        </button>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Сертификаты
          </h1>
          {pet && (
            <p className="text-gray-600 mt-1">
              {pet.name} • {pet.species || "Порода не указана"}
            </p>
          )}
        </div>

        {/* Список */}
        {certificates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
            У питомца пока нет сертификатов
          </div>
        ) : (
          <div className="space-y-6">
            {certificates.map((cert) => (
              <CertificateItem key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
