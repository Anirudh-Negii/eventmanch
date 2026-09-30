import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import eventmanchLogo from "../../assets/eventmanch-logo.png";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firstName = user?.name?.trim().split(/\s+/)[0];
  const displayName = firstName
    ? `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()}`
    : "";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleProfileOpen = () => {
    setMobileMenuOpen(false);
    setShowProfile(true);
  };

  return (
    <nav className="border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-ink">
          <img
            src={eventmanchLogo}
            alt="EventManch"
            className="h-12 w-36 object-contain sm:h-16 sm:w-48 lg:h-20 lg:w-64"
            draggable={false}
          />
        </Link>

        <div className="hidden items-center gap-4 text-sm font-semibold md:flex md:gap-7">
          <Link
            to="/events"
            className="text-ink/65 transition hover:text-coral"
          >
            Explore events
          </Link>
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="text-ink/65 transition hover:text-coral"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleProfileOpen}
                className="text-ink transition hover:text-coral"
                aria-label="Open profile"
              >
                {displayName}
              </button>
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-white transition hover:bg-coral"
              >
                Logout{" "}
                <FaArrowRight className="text-xs transition group-hover:translate-x-0.5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-ink/65 transition hover:text-coral"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="group flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-white transition hover:bg-coral"
              >
                Join EventManch{" "}
                <FaArrowRight className="text-xs transition group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/15 text-ink transition hover:border-coral hover:text-coral md:hidden"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`${mobileMenuOpen ? "block" : "hidden"} border-t border-ink/10 pb-5 md:hidden`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 pt-4 text-sm font-semibold lg:px-8">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-ink/70 transition hover:bg-white hover:text-coral"
          >
            Explore events
          </Link>
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-ink/70 transition hover:bg-white hover:text-coral"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleProfileOpen}
                className="rounded-xl px-4 py-3 text-left text-ink/70 transition hover:bg-white hover:text-coral"
              >
                {displayName}'s profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-white transition hover:bg-coral"
              >
                Logout <FaArrowRight className="text-xs" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-ink/70 transition hover:bg-white hover:text-coral"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-white transition hover:bg-coral"
              >
                Join EventManch <FaArrowRight className="text-xs" />
              </Link>
            </>
          )}
        </div>
      </div>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </nav>
  );
};

export default Navbar;
