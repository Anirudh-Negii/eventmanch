import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex min-h-[55vh] items-center justify-center px-5 py-16">
      <div className="max-w-md text-center">
        <span className="eyebrow text-coral text-6xl">404</span>
        <h1 className="display-heading mt-4 text-4xl text-ink sm:text-6xl">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink/55 sm:text-base">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          to="/events"
          className="mt-8 inline-flex rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-coral"
        >
          Back to events
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
