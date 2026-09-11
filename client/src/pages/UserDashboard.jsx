import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
        toast.success("Booking cancelled successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error cancelling booking",
        );
      }
    }
  };

  if (loading)
    return (
      <div className="px-5 py-24 text-center font-mono text-sm text-ink/50">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-ink p-7 text-center text-white shadow-soft sm:flex-row sm:items-start sm:p-10 sm:text-left">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-coral text-3xl font-bold uppercase tracking-widest">
            {user?.name.charAt(0)}
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              Welcome, {user?.name}!
            </h1>
            <p className="flex items-center justify-center gap-2 text-white/55 sm:justify-start">
              <span className="h-2 w-2 rounded-full bg-sun"></span> Personal
              dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-end justify-between border-b border-ink/10 pb-5">
        <h2 className="display-heading flex items-center gap-3 text-3xl text-ink sm:text-4xl">
          <FaTicketAlt className="text-coral" /> My bookings
        </h2>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-mist">
            <FaTicketAlt className="text-3xl text-moss" />
          </div>
          <p className="mb-6 mt-4 text-xl font-medium text-ink/55">
            You haven't booked any events yet.
          </p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-coral px-8 py-3 font-bold text-white transition hover:bg-ink"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex-grow border-b border-ink/10 p-6">
                {booking.eventId ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold leading-tight text-ink">
                        {booking.eventId.title}
                      </h3>
                      <div className="flex flex-col gap-1 items-end">
                        <span
                          className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span
                            className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                              booking.paymentStatus === "paid"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4 space-y-1">
                      <p>
                        <strong className="text-gray-700">Date:</strong>{" "}
                        {new Date(booking.eventId.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong className="text-gray-700">Amount:</strong>{" "}
                        {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                      </p>
                      <p>
                        <strong className="text-gray-700">Requested:</strong>{" "}
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-red-500 italic">
                    Event details unavailable (might have been deleted)
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center justify-between bg-paper p-4">
                {booking.eventId && booking.status !== "cancelled" ? (
                  <>
                    <Link
                      to={`/events/${booking.eventId._id}`}
                      className="text-sm font-semibold text-coral hover:underline"
                    >
                      View event
                    </Link>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="text-red-500 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center text-sm text-gray-500 italic">
                    Booking Cancelled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
