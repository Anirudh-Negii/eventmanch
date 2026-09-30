import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import PasswordInput from "./PasswordInput";

const ProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword && !currentPassword) {
      setError("Enter your current password to set a new password.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      toast.success("Profile updated successfully");
      onClose();
    } catch (updateError) {
      setError(updateError.message || updateError);
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="animate-profile-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 px-5 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="animate-profile-panel w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <FaUserCircle
              className="mb-3 text-3xl text-coral"
              aria-hidden="true"
            />
            <h2
              id="profile-modal-title"
              className="text-2xl font-bold text-ink"
            >
              Your profile
            </h2>
            <p className="mt-1 text-sm text-ink/55">
              Update your account information.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/45 transition hover:bg-ink/10 hover:text-ink"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              minLength="2"
              maxLength="80"
              className="field"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Email address
            </label>
            <input
              id="profile-email"
              type="email"
              className="field bg-ink/5 text-ink/55"
              value={user?.email || ""}
              readOnly
              disabled
            />
          </div>

          <div className="border-t border-ink/10 pt-5">
            <p className="mb-4 text-sm font-semibold text-ink">
              Change password
            </p>
            <div className="space-y-4">
              <PasswordInput
                id="profile-current-password"
                aria-label="Current password"
                placeholder="Current password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <PasswordInput
                id="profile-new-password"
                aria-label="New password"
                placeholder="New password"
                minLength="6"
                maxLength="128"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <PasswordInput
                id="profile-confirm-password"
                aria-label="Confirm new password"
                placeholder="Confirm new password"
                minLength="6"
                maxLength="128"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-ink/15 px-5 py-3 text-sm font-bold text-ink transition hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default ProfileModal;
