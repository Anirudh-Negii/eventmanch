import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
        setError("");
      } else {
        await verifyOTP(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-92px)] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.85fr_1fr] lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-ink/10 bg-white p-7 shadow-soft sm:p-10">
        <div className="mb-8">
          <span className="eyebrow text-coral">Join the calendar</span>
          <h2 className="display-heading mt-3 text-4xl text-ink">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-ink/55">
            Your best plans start here.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!showOTP ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <p className="mb-4 rounded-xl border border-moss/20 bg-mist p-3 text-sm text-moss">
                An OTP has been sent to your email. Please verify your account.
              </p>
              <label className="mb-2 block text-sm font-semibold text-ink">
                Verification code (OTP)
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
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-coral py-3.5 font-bold text-white shadow-sm transition hover:bg-ink focus:ring-4 focus:ring-coral/20"
          >
            {loading
              ? "Processing..."
              : showOTP
                ? "Verify & Complete"
                : "Sign Up"}
          </button>
        </form>

        {!showOTP && (
          <p className="mt-6 text-center text-sm text-ink/55">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-coral hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
      <div className="hidden rounded-[2rem] bg-coral p-12 text-ink lg:block">
        <span className="eyebrow">A fuller calendar awaits</span>
        <h1 className="display-heading mt-8 text-6xl leading-none">
          Go where the good energy is.
        </h1>
        <p className="mt-8 max-w-md leading-7 text-ink/70">
                From intimate workshops to city-wide celebrations, EventManch helps you
          make space for the things you care about.
        </p>
      </div>
    </div>
  );
};

export default Register;
