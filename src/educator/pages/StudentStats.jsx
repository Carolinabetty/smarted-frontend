import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabaseClient';

const StudentStats = () => {
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setStats([]);

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      console.error('Failed to fetch educator session');
      setLoading(false);
      return;
    }

    const educatorId = sessionData.session.user.id;

    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, module_count')
      .eq('educator_id', educatorId);

    if (coursesError || !courses) {
      console.error('Failed to fetch courses:', coursesError);
      setLoading(false);
      return;
    }

    const courseIds = courses.map((c) => c.id);

    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('student_id, course_id, enrolled_at');

    if (enrollmentsError || !enrollments) {
      console.error('Failed to fetch enrollments:', enrollmentsError);
      setLoading(false);
      return;
    }

    const relevantEnrollments = enrollments.filter((e) =>
      courseIds.includes(e.course_id)
    );

    const studentIds = [...new Set(relevantEnrollments.map((e) => e.student_id))];

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', studentIds);

    if (profilesError) {
      console.error('Failed to fetch student profiles:', profilesError);
      setLoading(false);
      return;
    }

    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('student_id, course_id, status');

    if (progressError) {
      console.error('Failed to fetch progress:', progressError);
      setLoading(false);
      return;
    }

    const statsData = relevantEnrollments.map((enroll) => {
      const student = profiles.find((p) => p.id === enroll.student_id);
      const course = courses.find((c) => c.id === enroll.course_id);
      const completed = progress.filter(
        (p) =>
          p.student_id === enroll.student_id &&
          p.course_id === enroll.course_id &&
          p.status === 'completed'
      );

      const totalModules = course?.module_count || 5;
      const completedModules = completed.length;
      const percent = Math.round((completedModules / totalModules) * 100);

      return {
        id: enroll.student_id + '_' + enroll.course_id,
        studentName: `${student?.first_name || ''} ${student?.last_name || ''}`,
        courseTitle: course?.title || 'Unknown Course',
        enrolledAt: new Date(enroll.enrolled_at).toLocaleDateString(),
        percentComplete: percent,
      };
    });

    const mockStats = [
      {
        id: 'mock-1',
        studentName: 'Amina K.',
        courseTitle: 'Intro to Writing',
        enrolledAt: '2024-05-20',
        percentComplete: 80,
      },
      {
        id: 'mock-2',
        studentName: 'Brian O.',
        courseTitle: 'Math Basics',
        enrolledAt: '2024-06-01',
        percentComplete: 40,
      },
      {
        id: 'mock-3',
        studentName: 'Sasha M.',
        courseTitle: 'Digital Literacy',
        enrolledAt: '2024-06-10',
        percentComplete: 100,
      },
    ];

    setStats(statsData.length > 0 ? statsData : mockStats);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const filteredStats = stats.filter((s) =>
    `${s.studentName} ${s.courseTitle}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Student Progress & Stats</h1>

      <input
        type="text"
        placeholder="Search by student or course..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 px-4 py-2 border rounded w-full md:w-1/2 bg-white"
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredStats.length === 0 ? (
        <p className="text-gray-500">No matching students found.</p>
      ) : (
        <div className="space-y-4">
          {filteredStats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl p-4 shadow border-l-4 border-blue-600"
            >
              <h2 className="text-lg font-semibold text-blue-800">{stat.studentName}</h2>
              <p className="text-sm text-gray-700">
                Course: <strong>{stat.courseTitle}</strong>
              </p>
              <p className="text-sm text-gray-600">Enrolled: {stat.enrolledAt}</p>

              <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${stat.percentComplete}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-blue-800 mt-1">
                {stat.percentComplete}% complete
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentStats;
