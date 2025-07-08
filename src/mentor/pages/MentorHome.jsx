// src/mentor/pages/MentorHome.jsx
import { Link } from 'react-router-dom';

const MentorHome = () => {
  return (
    <div className="p-6 bg-emerald-50 min-h-screen text-emerald-900">
      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2">Welcome to SmartEd Mentorship</h2>
        <p className="text-lg">
          Empower the next generation through guidance, connection, and knowledge-sharing.
        </p>
      </div>

      {/* Benefits Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Why Mentor on SmartEd?</h3>
        <ul className="list-disc ml-6 text-lg space-y-2">
          <li>Make a real impact on students' academic and personal growth.</li>
          <li>Share your expertise and professional journey.</li>
          <li>Grow your own leadership and communication skills.</li>
          <li>Be part of a thriving educational community.</li>
        </ul>
      </section>

      {/* How it works Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">How Mentorship Works</h3>
        <ol className="list-decimal ml-6 space-y-3 text-base">
          <li>Students send mentorship session requests.</li>
          <li>You review and accept requests that fit your schedule.</li>
          <li>Host live or asynchronous mentorship sessions.</li>
          <li>Post helpful resources your mentees can access anytime.</li>
        </ol>
      </section>

      {/* Quick Links Section */}
      <section className="text-center">
        <h3 className="text-xl font-semibold mb-4">Get Started</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/mentor/dashboard">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700 transition">
              Go to Dashboard
            </button>
          </Link>
          <Link to="/mentor/requests">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700 transition">
              View Requests
            </button>
          </Link>
          <Link to="/mentor/share-resources">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700 transition">
              Share a Resource
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MentorHome;
