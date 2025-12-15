import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { getClinicAppointments } from "shared/api/clinics";
import "./Calendar.css";
import DayEvents from "./DayEvents";
import EventModal from "./EventModal";

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function getMonthMatrix(date) {
  const start = startOfMonth(date);
  const matrix = [];
  const firstDayIndex = start.getDay();
  let current = new Date(start);
  current.setDate(current.getDate() - firstDayIndex);
  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    matrix.push(days);
  }
  return matrix;
}

export default function Calendar({ clinics }) {
  const [clinicId, setClinicId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getClinicAppointments(clinicId);
        // clinicId === null → все приёмы
        setAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [clinicId]);

  const matrix = useMemo(() => getMonthMatrix(current), [current]);

  const eventsByDay = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      if (!a.appointment_date) return;

      const d = new Date(a.appointment_date);
      const key = d.toDateString();

      if (!map[key]) map[key] = [];
      map[key].push({
        ...a,
        _startDate: d,
        title: a.notes || "Приём",
      });
    });
    return map;
  }, [appointments]);

  return (
    <div className="calendar-root">
      <div className="calendar-header">
        <div>
          <label className="mr-2">Клиника:</label>
          <select
            value={clinicId ?? "all"}
            onChange={(e) => {
              const v = e.target.value;
              setClinicId(v === "all" ? null : Number(v));
            }}
          >
            <option value="all">Все клиники</option>
            {clinics
              .filter((c) => appointments.some((a) => a.clinic === c.id))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <div className="calendar-nav">
          <button onClick={() => setCurrent(addMonths(current, -1))}>◀</button>
          <strong className="mx-3">{current.toLocaleString("ru", { month: "long", year: "numeric" })}</strong>
          <button onClick={() => setCurrent(addMonths(current, 1))}>▶</button>
        </div>
      </div>

      {loading ? (
        <p>Загрузка приёмов...</p>
      ) : (
        <div className="calendar-grid">
          <div className="calendar-row calendar-weekdays">
            {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((d) => (
              <div key={d} className="calendar-cell calendar-weekday">
                {d}
              </div>
            ))}
          </div>
          {matrix.map((week, wi) => (
            <div key={wi} className="calendar-row">
              {week.map((day) => {
                const key = day.toDateString();
                const evs = eventsByDay[key] || [];
                return (
                  <div
                    key={key}
                    className={`calendar-cell ${day.getMonth() !== current.getMonth() ? "muted" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="date-number">{day.getDate()}</div>
                    <div className="events-list">
                      {evs.slice(0, 3).map((e) => (
                        <div
                          key={e.id || e._startDate.toISOString()}
                          className="event-pill"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelectedEvent(e);
                          }}
                        >
                          {e.title || e.service || e.pet_name || "Приём"}
                          {console.log(e)}
                        </div>
                      ))}
                      {evs.length > 3 && <div className="more">+{evs.length - 3}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {selectedDate && (
        <DayEvents
          date={selectedDate}
          events={eventsByDay[selectedDate.toDateString()] || []}
          onClose={() => setSelectedDate(null)}
          onEventClick={(e) => setSelectedEvent(e)}
        />
      )}

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}

Calendar.propTypes = {
  clinics: PropTypes.array.isRequired,
};
