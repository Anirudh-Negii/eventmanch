import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));
const NotFound = lazy(() => import("./pages/NotFound"));

function AdminOnlyRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") {
    return children;
  }

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-paper flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center px-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/45">
                  Loading EventManch...
                </p>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/payment-success"
                element={
                  <AdminOnlyRoute>
                    <PaymentSuccess />
                  </AdminOnlyRoute>
                }
              />
              <Route
                path="/payment-failed"
                element={
                  <AdminOnlyRoute>
                    <PaymentFailed />
                  </AdminOnlyRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
