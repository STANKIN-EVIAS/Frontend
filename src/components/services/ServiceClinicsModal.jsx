import ClinicsList from "components/Clinics/ClinicsList";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getClinics } from "shared/api/clinics";
import { useLockBodyScroll } from "./useLockBodyScroll"; // путь по вашему проекту

const ModalContent = ({ children, onClose, className = "" }) => {
  // контейнер модалки — обработка клика внутри
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg overflow-auto max-h-[80vh] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

const ServiceClinicsModal = ({ service, onClose }) => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // блокируем прокрутку фона
  useLockBodyScroll(Boolean(service));

  useEffect(() => {
    if (!service) return;

    let mounted = true;
    const fetchClinics = async () => {
      setLoading(true);
      setError(null);
      try {
        const allClinics = await getClinics();
        if (!mounted) return;
        const filtered = allClinics.filter(
          (clinic) => Array.isArray(clinic.services) && clinic.services.some((s) => s.id === service.id)
        );
        setClinics(filtered);
      } catch (err) {
        if (!mounted) return;
        setError("Не удалось загрузить клиники");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchClinics();

    return () => {
      mounted = false;
    };
  }, [service]);

  // закрытие по Esc
  useEffect(() => {
    if (!service) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [service, onClose]);

  if (!service) return null;

  // Портал в body — надёжнее, чем вложенный рендер
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      // клик по контейнеру (оверлею) закрывает модалку
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <ModalContent onClose={onClose}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Клиники, предлагающие «{service.name}»</h3>
          <button onClick={onClose} aria-label="Закрыть" className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        <div className="p-4">
          {loading && <div className="text-center text-gray-600">Загрузка клиник...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && clinics.length === 0 && (
            <div className="text-center text-gray-600">Клиники не найдены для этой услуги</div>
          )}
          {!loading && clinics.length > 0 && <ClinicsList clinics={clinics} />}
        </div>
      </ModalContent>
    </div>,
    document.body
  );
};

export default ServiceClinicsModal;
