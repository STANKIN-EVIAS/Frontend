import { Link } from "react-router-dom";

export default function EventModal({ event, onClose }) {
  return (
    <div className="event-modal-backdrop" onClick={onClose}>
      <div
        className="event-modal bg-white rounded-xl p-5 shadow-lg max-w-md mx-auto mt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="event-modal-header flex justify-between items-center mb-3">
          <strong className="text-lg">{event.title || event.service_name || "Приём"}</strong>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="event-modal-body space-y-2 text-sm">
          {event.clinic_name && (
            <p>
              <strong>Клиника:</strong>{" "}
              <Link
                to={`/clinics/${event.clinic}`} // ссылка на страницу клиники
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {event.clinic_name}
              </Link>
            </p>
          )}

          <p>
            <strong>Время:</strong> {event._startDate ? event._startDate.toLocaleString() : event.start}
          </p>

          {event.pet_name && (
            <p>
              <strong>Животное:</strong>{" "}
              <Link
                to={`/pet/${event.pet}`} // ссылка на страницу питомца
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {event.pet_name}
              </Link>
            </p>
          )}

          {event.user_name && (
            <p>
              <strong>Владелец:</strong> {event.user_name}
            </p>
          )}

          {event.service_name && (
            <p>
              <strong>Услуга:</strong> {event.service_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
