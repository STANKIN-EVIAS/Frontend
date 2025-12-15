export default function DayEvents({ date, events, onClose, onEventClick }) {
  return (
    <div className="day-events">
      <div className="day-events-header">
        <strong>{date.toLocaleDateString()}</strong>
        <button onClick={onClose}>Закрыть</button>
      </div>
      <div className="day-events-list">
        {events.length === 0 && <p>Нет приёмов</p>}
        {events.map((e) => (
          <div key={e.id || e._startDate?.toISOString()} className="day-event" onClick={() => onEventClick(e)}>
            <div className="day-event-time">
              {e._startDate ? e._startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
            </div>
            <div className="day-event-title">{e.title || e.service || e.pet?.name || "Приём"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
