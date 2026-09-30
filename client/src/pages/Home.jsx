import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaHeart } from "react-icons/fa";
import eventmanchLogo from "../../assets/eventmanch-logo.png";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400); // 400ms debounce
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
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="relative mb-16 overflow-hidden rounded-[2rem] bg-ink text-white shadow-soft">
        <div className="absolute inset-y-5 right-5 hidden w-[44%] rounded-[1.5rem] bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center opacity-70 md:block"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(232,111,81,0.35),transparent_35%)]"></div>
        <div className="relative z-10 max-w-2xl px-7 py-14 sm:px-12 sm:py-20 md:max-w-[54%] md:px-16 md:pr-10">
          <span className="eyebrow text-sun">Your city, in full colour</span>
          <h1 className="display-heading mt-6 text-5xl leading-[0.98] sm:text-7xl">
            Make plans worth <span className="text-coral">remembering.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-white/65 sm:text-lg">
            Find brilliant things to do, from ideas-led talks to late-night
            dance floors. Your next good story starts here.
          </p>

          <div className="group relative mt-10 flex max-w-xl items-center">
            <FaSearch className="absolute left-5 text-ink/45 transition-colors group-focus-within:text-coral" />
            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full rounded-2xl border-2 border-white/10 bg-white py-4 pl-12 pr-5 text-sm text-ink outline-none transition focus:border-coral placeholder:text-ink/40 sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-20 grid grid-cols-1 gap-4 border-y border-ink/10 py-5 md:grid-cols-3">
        <div className="flex gap-4 p-4 md:border-r md:border-ink/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sun text-ink">
            <FaRegClock />
          </div>
          <div>
            <h3 className="font-bold text-ink">Easy booking</h3>
            <p className="mt-1 text-sm leading-5 text-ink/55">
              Your spot, secured in a few clicks.
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-4 md:border-r md:border-ink/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-moss">
            <FaTicketAlt />
          </div>
          <div>
            <h3 className="font-bold text-ink">Real experiences</h3>
            <p className="mt-1 text-sm leading-5 text-ink/55">
              Curated moments, not endless scrolling.
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral text-white">
            <FaShieldAlt />
          </div>
          <div>
            <h3 className="font-bold text-ink">Peace of mind</h3>
            <p className="mt-1 text-sm leading-5 text-ink/55">
              Secure registration from start to finish.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between border-b border-ink/10 pb-5">
        <div>
          <span className="eyebrow text-coral">The calendar</span>
          <h2 className="display-heading mt-2 text-4xl text-ink sm:text-5xl">
            Upcoming events
          </h2>
        </div>
        <div className="font-mono text-xs text-ink/50">
          {events.length} results
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl font-semibold text-gray-600">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-xl text-gray-500">
          No events found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative h-56 overflow-hidden bg-mist">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
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
                    <span className="text-gray-900">₹{event.ticketPrice}</span>
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
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-24 border-t border-ink/10 pb-8 pt-8">
        <div className="grid grid-cols-1 items-center gap-6 text-center text-sm md:grid-cols-3 md:text-left">
          <div className="flex justify-center md:justify-start">
            <img
              src={eventmanchLogo}
              alt="EventManch"
              className="h-12 w-40 object-contain"
              draggable={false}
            />
          </div>
          <p className="flex items-center justify-center gap-2 text-ink/60">
            Made with <FaHeart className="text-coral" aria-hidden="true" /> by
            <span className="font-semibold text-ink">Anirudh</span>
          </p>
          <p className="text-xs font-medium uppercase tracking-wider text-ink/45 md:text-right">
            &copy; {new Date().getFullYear()} EventManch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
