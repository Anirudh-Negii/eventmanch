import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaArrowRight, FaTicketAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white">
            <FaTicketAlt />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight">
            Eventora<span className="text-coral">.</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold sm:gap-7">
          <Link
            to="/"
            className="hidden text-ink/65 transition hover:text-coral sm:block"
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
                Join Eventora{" "}
                <FaArrowRight className="text-xs transition group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
