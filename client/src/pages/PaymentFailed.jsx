import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-coral/20 bg-white p-8 text-center shadow-soft sm:p-10">
        <FaTimesCircle className="mx-auto mb-6 text-6xl text-coral" />
        <span className="eyebrow text-coral">Something went wrong</span>
        <h1 className="display-heading mb-4 mt-3 text-4xl text-ink">
          Booking failed
        </h1>
        <p className="mb-8 text-base leading-7 text-ink/55">
          We couldn't process your payment. Please ensure your payment details
          are correct and try again.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full rounded-xl bg-coral px-6 py-4 font-bold text-white transition hover:bg-ink"
          >
            Return to Events
          </Link>
          <Link
            to="/dashboard"
            className="block w-full rounded-xl bg-paper px-6 py-4 font-bold text-ink transition hover:bg-sun"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
