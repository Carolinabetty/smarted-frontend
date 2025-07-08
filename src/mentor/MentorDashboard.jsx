// src/mentor/MentorDashboard.jsx
import { Link } from 'react-router-dom';
import MentorCard from './components/MentorCard';

const MentorDashboard = () => {
  return (
    <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <MentorCard
        title="Upcoming Sessions"
        description="Your scheduled mentorship sessions"
      >
        <ul className="text-sm text-gray-800 list-disc ml-5">
          <li>Today 3PM - Amina M.</li>
          <li>Tomorrow 10AM - Brian O.</li>
        </ul>
        <Link to="/mentor/requests">
          <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">
            Manage Sessions
          </button>
        </Link>
      </MentorCard>

      <MentorCard
        title="Mentorship Requests"
        description="3 students are requesting sessions"
      >
        <p className="text-gray-700">Respond and schedule a time.</p>
        <Link to="/mentor/requests">
          <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">
            View Requests
          </button>
        </Link>
      </MentorCard>

      <MentorCard
        title="Recent Resources"
        description="Your shared materials"
      >
        <ul className="text-sm text-gray-800 list-disc ml-5">
          <li>Time Management Tips</li>
          <li>Career Pathways in Tech</li>
        </ul>
        <Link to="/mentor/share-resources">
          <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">
            Share More
          </button>
        </Link>
      </MentorCard>

      <MentorCard
        title="Quick Access"
        description="Jump to shared tools"
      >
        <div className="flex space-x-4">
          <Link to="/mentor/community">
            <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
              Community
            </button>
          </Link>
          <Link to="/mentor/library">
            <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
              Library
            </button>
          </Link>
        </div>
      </MentorCard>
    </main>
  );
};

export default MentorDashboard;
