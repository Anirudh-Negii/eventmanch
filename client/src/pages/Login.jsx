import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        const data = await login(email, password);
        if (data.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      } else {
        const data = await verifyOTP(email, otp);
        if (data.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err) {
      if (err.needsVerification) {
        setShowOTP(true);
        setError(
          "Account not verified. A new OTP has been sent to your email.",
        );
      } else {
        setError(err.message || err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-92px)] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_0.85fr] lg:px-8">
      <div className="hidden rounded-[2rem] bg-ink p-12 text-white lg:block">
        <span className="eyebrow text-sun">Welcome back</span>
        <h1 className="display-heading mt-8 text-6xl leading-none">
          Your next great night is still out there.
        </h1>
        <p className="mt-8 max-w-md leading-7 text-white/60">
          Keep your plans close, discover something new, and pick up exactly
          where you left off.
        </p>
        <div className="mt-20 border-t border-white/15 pt-5 font-mono text-xs text-white/45">
          EVENTMANCH / MEMBER ACCESS
        </div>
      </div>
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-ink/10 bg-white p-7 shadow-soft sm:p-10">
        <div className="mb-8">
          <span className="eyebrow text-coral">Member access</span>
          <h2 className="display-heading mt-3 text-4xl text-ink">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-ink/55">
            Sign in to your EventManch account
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!showOTP ? (
            <>
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
            className="w-full rounded-xl bg-coral py-3.5 font-bold text-white shadow-sm transition hover:bg-ink focus:ring-4 focus:ring-coral/20"
          >
            {loading
              ? "Processing..."
              : showOTP
                ? "Verify OTP & Log In"
                : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink/55">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-coral hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
