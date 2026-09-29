import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <header className="mb-10 flex flex-col gap-7 border-b border-ink/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display-heading mt-3 text-5xl text-ink sm:text-6xl">
            Explore events
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink/55 sm:text-base">
            Find your next memorable experience.
          </p>
        </div>

        <div className="group relative w-full sm:max-w-sm">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 transition-colors group-focus-within:text-coral" />
          <input
            type="text"
            placeholder="Search events by title..."
            className="field pl-11"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-ink/55">
          All events
        </h2>
        <span className="font-mono text-xs text-ink/50">
          {events.length} results
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-ink/50">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 bg-white/50 py-20 text-center text-ink/55">
          No events found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative h-56 overflow-hidden bg-mist">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-mist font-display text-2xl text-moss">
                    {event.category || "Event"}
                  </div>
                )}
                <div className="absolute right-4 top-4 rounded-full bg-paper/95 px-3 py-1.5 text-sm font-bold shadow-sm">
                  {event.ticketPrice === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span className="text-ink">₹{event.ticketPrice}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-grow flex-col p-6">
                <div className="eyebrow text-coral">{event.category}</div>
                <h2 className="mt-2 text-xl font-bold leading-tight text-ink">
                  {event.title}
                </h2>
                <div className="mb-4 mt-5 flex flex-col gap-2 text-sm text-ink/60">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-coral" />
                    <span>
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-coral" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="mb-2 h-1.5 w-full rounded-full bg-ink/10">
                    <div
                      className="h-1.5 rounded-full bg-coral"
                      style={{
                        width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="mb-4 text-xs text-ink/45">
                    {event.availableSeats} of {event.totalSeats} seats remaining
                  </p>
                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full rounded-xl bg-ink py-3 text-center text-sm font-bold text-white transition hover:bg-coral"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
