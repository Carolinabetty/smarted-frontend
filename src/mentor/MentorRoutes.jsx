// src/mentor/MentorRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import MentorHeader from './components/MentorHeader';
import MentorNavBar from './components/MentorNavBar';
import MentorFooter from './components/MentorFooter';
import MentorHome from './pages/MentorHome';
import MentorDashboard from './MentorDashboard';
import MentorshipRequests from './pages/MentorshipRequests';
import ShareResources from './pages/ShareResources';
import Community from '../student/pages/Community';
import Library from '../student/pages/Library';
import MentorSession from './pages/MentorSession'; // ✅ Import this

const MentorRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-emerald-50">
      <MentorHeader />
      <MentorNavBar />
      
      <main className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<MentorHome />} />
          <Route path="/dashboard" element={<MentorDashboard />} />
          <Route path="/requests" element={<MentorshipRequests />} />
          <Route path="/share-resources" element={<ShareResources />} />
          <Route path="/community" element={<Community />} />
          <Route path="/library" element={<Library />} />

          {/* ✅ NEW: Real-time chat route */}
          <Route path="/session/:id" element={<MentorSession />} />
        </Routes>
      </main>
      
      <MentorFooter />
    </div>
  );
};

export default MentorRoutes;
