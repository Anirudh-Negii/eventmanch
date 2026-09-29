import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });
  const today = new Date();
  const minEventDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/my"), // Admin gets all bookings
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    try {
      await api.post("/events", formData);
      setShowEventForm(false);
      setValidationErrors([]);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
      });
      fetchData();
      toast.success("Event created successfully");
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (Array.isArray(errors)) {
        setValidationErrors(errors);
      }
      toast.error(error.response?.data?.message || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setPendingAction(null);
      fetchData();
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting event");
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      fetchData();
      toast.success("Booking confirmed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setPendingAction(null);
      fetchData();
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling booking");
    }
  };

  if (loading)
    return (
      <div className="px-5 py-24 text-center font-mono text-sm text-ink/50">
        Loading admin panel...
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-ink p-7 text-center text-white shadow-soft md:flex-row md:p-10 md:text-left">
        <div>
          <span className="eyebrow text-sun">Control room</span>
          <h1 className="display-heading mb-2 mt-3 text-4xl sm:text-5xl">
            Admin dashboard
          </h1>
          <p className="text-white/55">
            Manage events and manually confirm bookings.
          </p>
        </div>
        <button
          onClick={() => {
            setShowEventForm(!showEventForm);
            setValidationErrors([]);
          }}
          className="w-full rounded-xl bg-coral px-6 py-3 font-bold text-white transition hover:bg-sun hover:text-ink md:w-auto"
        >
          {showEventForm ? "Cancel Creation" : "+ Create New Event"}
        </button>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <div>
            <p className="eyebrow text-ink/45">Total revenue</p>
            <h3 className="mt-2 text-3xl font-black text-moss">
              ₹
              {bookings.reduce(
                (sum, b) =>
                  b.paymentStatus === "paid" && b.status === "confirmed"
                    ? sum + b.amount
                    : sum,
                0,
              )}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-xl font-bold text-moss">
            ₹
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <div>
            <p className="eyebrow text-ink/45">Paid clients</p>
            <h3 className="mt-2 text-3xl font-black text-coral">
              {
                new Set(
                  bookings
                    .filter(
                      (b) =>
                        b.paymentStatus === "paid" && b.status === "confirmed",
                    )
                    .map((b) => b.userId?._id),
                ).size
              }
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sun text-xl font-bold text-ink">
            @
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <div>
            <p className="eyebrow text-ink/45">Pending requests</p>
            <h3 className="mt-2 text-3xl font-black text-ink">
              {bookings.filter((b) => b.status === "pending").length}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-paper text-xl font-bold text-coral">
            !
          </div>
        </div>
      </div>

      {showEventForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animation-slideDown">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Create New Event
          </h2>
          {validationErrors.length > 0 && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-bold">Please fix the following:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {validationErrors.map((error, index) => (
                  <li key={`${error.field}-${index}`}>
                    <span className="font-semibold">{error.field}:</span>{" "}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              required
              type="text"
              minLength={3}
              placeholder="Event Title"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Category (e.g., Tech, Music)"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              required
              type="date"
              min={minEventDate}
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Location"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              required
              type="number"
              min={1}
              placeholder="Total Seats"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
            <input
              required
              type="number"
              min={0}
              placeholder="Ticket Price (0 for free)"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
            />

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Image URL (Provide any direct link to an image)"
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            <textarea
              required
              minLength={20}
              placeholder="Event Description"
              className="border px-4 py-3 rounded-lg md:col-span-2 h-32 focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <button
              type="submit"
              className="md:col-span-2 bg-gray-900 text-white font-bold py-3 mt-2 rounded-lg hover:bg-black transition shadow-md"
            >
              Publish Event
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">
              {events.length}
            </span>
            All Events
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {events.length === 0 ? (
                <li className="p-6 text-gray-500 text-center">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 leading-tight">
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1 font-medium">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <div
                            className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? "bg-green-500" : "bg-red-500"}`}
                          ></div>{" "}
                          {event.availableSeats}/{event.totalSeats} seats
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPendingAction({
                          type: "delete-event",
                          id: event._id,
                        })
                      }
                      className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm shrink-0"
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
              {bookings.length}
            </span>
            Booking Requests
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {bookings.length === 0 ? (
                <li className="p-6 text-gray-500 text-center">
                  No bookings yet.
                </li>
              ) : (
                bookings.map((booking) => (
                  <li
                    key={booking._id}
                    className={`p-6 hover:bg-gray-50 transition border-l-4 ${booking.status === "pending" ? "border-l-yellow-400" : booking.status === "confirmed" ? "border-l-green-400" : "border-l-red-400"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">
                        {booking.eventId?.title || "Deleted Event"}
                      </h4>
                      <div className="flex flex-col gap-1 items-end shrink-0 ml-4">
                        <span
                          className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span
                            className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === "paid" ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-800"}`}
                          >
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100 text-sm">
                      <p className="text-gray-700 flex items-center gap-2 mb-1">
                        <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                          User:
                        </span>
                        <span className="font-semibold">
                          {booking.userId?.name}
                        </span>
                        <span className="text-gray-400">
                          ({booking.userId?.email})
                        </span>
                      </p>
                      <p className="text-gray-700 flex items-center gap-2 mb-1">
                        <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                          Amount:
                        </span>
                        <span
                          className={`font-semibold ${booking.amount === 0 ? "text-green-600" : ""}`}
                        >
                          {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                        </span>
                      </p>
                      <p className="text-gray-700 flex items-center gap-2 mb-1">
                        <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                          Date:
                        </span>
                        <span>
                          {new Date(booking.bookedAt).toLocaleString()}
                        </span>
                      </p>
                      {booking.eventId && (
                        <p className="text-gray-700 flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                          <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                            Seats:
                          </span>
                          <span
                            className={`font-bold ${booking.eventId.availableSeats > 0 ? "text-green-600" : "text-red-500"}`}
                          >
                            {booking.eventId.availableSeats}
                          </span>{" "}
                          remaining of {booking.eventId.totalSeats}
                        </p>
                      )}
                    </div>

                    {booking.status === "pending" && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "paid")
                          }
                          className="flex-1 min-w-[120px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition"
                        >
                          ✓ Approve as Paid
                        </button>
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "not_paid")
                          }
                          className="flex-1 min-w-[120px] bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition"
                        >
                          ✓ Approve Undecided
                        </button>
                        <button
                          onClick={() =>
                            setPendingAction({
                              type: "cancel-booking",
                              id: booking._id,
                            })
                          }
                          className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg transition"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete-event"
            ? "Delete this event?"
            : "Cancel this booking?"
        }
        message={
          pendingAction?.type === "delete-event"
            ? "This event and its listing will be removed from EventManch."
            : "This booking request will be cancelled and the user will lose their reservation."
        }
        confirmLabel={
          pendingAction?.type === "delete-event"
            ? "Delete event"
            : "Cancel booking"
        }
        onConfirm={() =>
          pendingAction?.type === "delete-event"
            ? handleDeleteEvent(pendingAction.id)
            : handleCancelBooking(pendingAction.id)
        }
        onClose={() => setPendingAction(null)}
      />
    </div>
  );
};

export default AdminDashboard;
