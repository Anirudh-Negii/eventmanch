import { useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-5 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-6 shadow-2xl sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral/15 text-coral">
            <FaExclamationTriangle />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close confirmation dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/45 transition hover:bg-ink/10 hover:text-ink"
          >
            <FaTimes />
          </button>
        </div>
        <h2
          id="confirm-modal-title"
          className="mt-5 text-xl font-bold text-ink"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">{message}</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-ink/15 px-4 py-3 text-sm font-bold text-ink transition hover:bg-white"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-coral px-4 py-3 text-sm font-bold text-white transition hover:bg-ink"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
