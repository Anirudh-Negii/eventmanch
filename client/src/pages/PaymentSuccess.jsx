import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-moss/20 bg-white p-8 text-center shadow-soft sm:p-10">
        <FaCheckCircle className="mx-auto mb-6 text-6xl text-moss" />
        <span className="eyebrow text-moss">All set</span>
        <h1 className="display-heading mb-4 mt-3 text-4xl text-ink">
          Booking confirmed
        </h1>
        <p className="mb-8 text-base leading-7 text-ink/55">
          Your ticket has been booked successfully. A confirmation email has
          been sent to your registered email address.
        </p>
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full rounded-xl bg-moss px-6 py-4 font-bold text-white transition hover:bg-ink"
          >
            View My Tickets
          </Link>
          <Link
            to="/"
            className="block w-full rounded-xl bg-paper px-6 py-4 font-bold text-ink transition hover:bg-sun"
          >
            Discover More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
