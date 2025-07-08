import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const EducatorHome = () => {
  const [educatorName, setEducatorName] = useState('');
  const [totalCourses, setTotalCourses] = useState(0);
  const [recentCourses, setRecentCourses] = useState([]);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profile?.first_name || profile?.last_name) {
        setEducatorName(`${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim());
      }

      const { count } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('educator_id', user.id);

      setTotalCourses(count || 0);

      const { data: recent } = await supabase
        .from('courses')
        .select('id, title, created_at')
        .eq('educator_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentCourses(recent || []);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8 bg-blue-50 min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold">
          {getGreeting()}
          {educatorName ? `, ${educatorName}` : ''} 👋
        </h1>
        <p className="text-blue-100 mt-2 text-lg">
          Here’s what’s happening with your SmartEd account today.
        </p>
      </div>

      {/* Stats and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-800">📚 Total Courses Uploaded</h2>
          <p className="text-5xl font-bold text-blue-600 mt-4">{totalCourses}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-800">⚡ Quick Actions</h2>
          <div className="mt-4 flex flex-col space-y-4">
            <button
              onClick={() => navigate('/educator/upload-course')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
              ➕ Upload New Course
            </button>
            <button
              onClick={() => navigate('/educator/manage-courses')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg transition"
            >
              📁 Manage My Courses
            </button>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">🕘 Recently Uploaded</h2>
        {recentCourses.length === 0 ? (
          <p className="text-gray-600">You haven’t uploaded any courses recently.</p>
        ) : (
          <ul className="space-y-3">
            {recentCourses.map((course) => (
              <li
                key={course.id}
                className="flex justify-between items-center border-b border-blue-100 pb-2"
              >
                <span className="text-blue-700">{course.title}</span>
                <span className="text-sm text-gray-500">
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EducatorHome;
