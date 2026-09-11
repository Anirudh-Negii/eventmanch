import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave } from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg(
          "OTP sent to your email. Please verify to confirm booking.",
        );
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        setSuccessMsg("Booking requested! Awaiting admin confirmation.");
        setShowOTP(false);
        // Update local seats count dynamically after booking
        setEvent({ ...event, availableSeats: event.availableSeats - 1 });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="px-5 py-24 text-center font-mono text-sm text-ink/50">
        Loading event...
      </div>
    );
  if (error && !event)
    return (
      <div className="px-5 py-24 text-center text-xl text-red-500">
        {error || "Event not found"}
      </div>
    );

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-72 w-full object-cover sm:h-96"
          />
        ) : (
          <div className="flex h-72 w-full items-center justify-center bg-ink font-display text-6xl uppercase tracking-widest text-white/50">
            {event.category}
          </div>
        )}

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8 flex flex-col items-start justify-between gap-10 lg:flex-row">
            <div className="max-w-2xl">
              <div className="eyebrow text-coral">{event.category}</div>
              <h1 className="display-heading mb-5 mt-3 text-4xl leading-tight text-ink sm:text-6xl">
                {event.title}
              </h1>
              <p className="mb-6 text-base leading-7 text-ink/60 sm:text-lg">
                {event.description}
              </p>
            </div>

            <div className="w-full shrink-0 rounded-2xl border border-ink/10 bg-paper p-6 lg:w-[340px]">
              <h3 className="mb-6 font-display text-2xl font-bold text-ink">
                Booking details
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun text-ink">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase">
                      Ticket Price
                    </p>
                    <p className="font-bold text-gray-800 text-lg">
                      {event.ticketPrice === 0 ? (
                        <span className="text-green-500">Free</span>
                      ) : (
                        `₹${event.ticketPrice}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist text-moss">
                    <FaChair />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase">
                      Availability
                    </p>
                    <p className="font-bold text-gray-800">
                      <span
                        className={
                          event.availableSeats < 10 ? "text-orange-500" : ""
                        }
                      >
                        {event.availableSeats}
                      </span>{" "}
                      / {event.totalSeats}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral text-white">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase">
                      Date
                    </p>
                    <p className="font-bold text-gray-800">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase">
                      Location
                    </p>
                    <p className="font-bold text-gray-800">{event.location}</p>
                  </div>
                </div>
              </div>

              {showOTP && (
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-ink">
                    Enter OTP to confirm
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit code"
                    className="field text-center text-lg font-bold tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                  />
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition shadow-lg ${
                  isSoldOut || (successMsg && !showOTP)
                    ? "cursor-not-allowed bg-ink/15 text-ink/40"
                    : "bg-coral text-white hover:bg-ink hover:shadow-xl"
                }`}
              >
                {bookingLoading
                  ? "Processing..."
                  : showOTP
                    ? "Verify OTP & Confirm"
                    : successMsg && !showOTP
                      ? "Request Sent"
                      : isSoldOut
                        ? "Sold Out"
                        : "Confirm Registration"}
              </button>
              {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-500">
                  {error}
                </p>
              )}
              {successMsg && (
                <p className="mt-4 rounded-xl bg-mist p-3 text-center text-sm font-medium text-moss">
                  {successMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
