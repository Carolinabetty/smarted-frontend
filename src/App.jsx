import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from './supabaseClient';

// Public pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UpdateProfile from './pages/UpdateProfile'; // ✅ NEW

// Student dashboard and subpages
import StudentDashboard from './student/StudentDashboard';
import StudentHome from './student/pages/StudentHome';
import Courses from './student/pages/Courses';
import Community from './student/pages/Community';
import Mentorship from './student/pages/Mentorship';
import Library from './student/pages/Library';
import ResourceLibrary from './student/pages/ResourceLibrary';
import RequestMentor from './student/pages/RequestMentor';
import MyMentorships from './student/pages/MyMentorships';
import StudentSession from './student/pages/StudentSession';

// Educator dashboard and subpages
import EducatorDashboard from './educator/EducatorDashboard';
import EducatorHome from './educator/pages/EducatorHome';
import ManageCourses from './educator/pages/ManageCourses';
import UploadCourse from './educator/pages/UploadCourse';
import StudentStats from './educator/pages/StudentStats';
import DiscussionBoard from './educator/pages/DiscussionBoard';

// Mentor dashboard
import MentorRoutes from './mentor/MentorRoutes';

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home user={user} i18n={i18n} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/update-profile"
        element={
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<StudentHome />} />
        <Route path="courses" element={<Courses />} />
        <Route path="community" element={<Community />} />
        <Route path="mentorship" element={<Mentorship />} />
        <Route path="library" element={<Library />} />
        <Route path="resources" element={<ResourceLibrary />} />
        <Route path="request-mentor" element={<RequestMentor />} />
        <Route path="my-mentorships" element={<MyMentorships />} />
        <Route path="session/:sessionId" element={<StudentSession />} />
      </Route>

      {/* Educator routes */}
      <Route
        path="/educator"
        element={
          <PrivateRoute>
            <EducatorDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<EducatorHome />} />
        <Route path="manage-courses" element={<ManageCourses />} />
        <Route path="upload-course" element={<UploadCourse />} />
        <Route path="student-stats" element={<StudentStats />} />
        <Route path="discussion-board" element={<DiscussionBoard />} />
        <Route path="library" element={<Library />} />
        <Route path="community" element={<Community />} />
      </Route>

      {/* Mentor routes */}
      <Route
        path="/mentor/*"
        element={
          <PrivateRoute>
            <MentorRoutes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
