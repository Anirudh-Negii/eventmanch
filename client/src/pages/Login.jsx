import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [resetStep, setResetStep] = useState("idle");
  const [resetOtp, setResetOtp] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, verifyOTP, requestPasswordReset, resetPassword } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      if (resetStep === "otp") {
        if (resetPasswordValue !== confirmResetPassword) {
          setError("New passwords do not match.");
          return;
        }

        await resetPassword(email, resetOtp, resetPasswordValue);
        setResetStep("idle");
        setResetOtp("");
        setResetPasswordValue("");
        setConfirmResetPassword("");
        setSuccessMessage("Password reset successfully. You can now sign in.");
      } else if (!showOTP) {
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

  const handleForgotPassword = (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setShowResetConfirmation(true);
  };

  const handleSendResetOtp = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    try {
      await requestPasswordReset(email.trim());
      setShowResetConfirmation(false);
      setResetStep("otp");
      setSuccessMessage(
        "If an account exists for this email, a password reset OTP has been sent.",
      );
    } catch (resetError) {
      setError(resetError.message || resetError);
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
        {successMessage && (
          <div className="mb-6 rounded-xl border border-moss/20 bg-mist p-3 text-center text-sm text-moss">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {resetStep === "otp" ? (
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
                  Password reset OTP
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="6-digit code"
                  className="field text-center text-lg font-bold tracking-widest"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  maxLength="6"
                />
              </div>
              <PasswordInput
                id="reset-password"
                label="New password"
                required
                minLength="6"
                maxLength="128"
                autoComplete="new-password"
                value={resetPasswordValue}
                onChange={(e) => setResetPasswordValue(e.target.value)}
              />
              <PasswordInput
                id="confirm-reset-password"
                label="Confirm new password"
                required
                minLength="6"
                maxLength="128"
                autoComplete="new-password"
                value={confirmResetPassword}
                onChange={(e) => setConfirmResetPassword(e.target.value)}
              />
            </>
          ) : !showOTP ? (
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
              <PasswordInput
                id="login-password"
                label="Password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="-mt-3 text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-semibold text-coral hover:underline"
                >
                  Forgot password?
                </button>
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
              : resetStep === "otp"
                ? "Reset Password"
              : showOTP
                ? "Verify OTP & Log In"
                : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink/55">
          {resetStep === "otp" ? "Remember your password?" : "Don't have an account?"}{" "}
          <Link to="/register" className="font-bold text-coral hover:underline">
            {resetStep === "otp" ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
      <ConfirmModal
        isOpen={showResetConfirmation}
        title="Reset your password?"
        message={`Send a password reset OTP to ${email}?`}
        confirmLabel={loading ? "Sending..." : "Send OTP"}
        onConfirm={handleSendResetOtp}
        onClose={() => setShowResetConfirmation(false)}
      />
    </div>
  );
};

export default Login;
