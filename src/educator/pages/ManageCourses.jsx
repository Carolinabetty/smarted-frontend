import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import CourseDetailsModal from './CourseDetailsModal';
import SearchBar from '../components/SearchBar';

const mockCourses = [
  {
    id: 'mock-1',
    title: 'Introduction to Data Science',
    category: 'Technology',
    thumbnail_url: 'https://via.placeholder.com/400x250.png?text=Data+Science',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Business Strategy Basics',
    category: 'Business',
    thumbnail_url: 'https://via.placeholder.com/400x250.png?text=Business+Strategy',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Creative Writing Workshop',
    category: 'Arts',
    thumbnail_url: 'https://via.placeholder.com/400x250.png?text=Creative+Writing',
    created_at: new Date().toISOString(),
  },
];

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [useMock, setUseMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setFetchError('');

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        setFetchError('Could not get educator session.');
        setLoading(false);
        return;
      }

      const user = sessionData.session.user;

      const { data: courseList, error: fetchCoursesError } = await supabase
        .from('courses')
        .select('id, title, category, thumbnail_url, created_at')
        .eq('educator_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchCoursesError) {
        setFetchError(fetchCoursesError.message);
      } else if (!courseList || courseList.length === 0) {
        setUseMock(true);
        setCourses(mockCourses); // fallback to mock
      } else {
        setCourses(courseList);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery) ||
    course.category.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Manage My Courses</h1>

      <SearchBar onSearch={setSearchQuery} />

      {loading ? (
        <p>Loading...</p>
      ) : fetchError ? (
        <p className="text-red-500">{fetchError}</p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-gray-600">No courses found.</p>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-blue-800">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.category}</p>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(course.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(course)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          isMock={useMock}
          onDelete={(deletedId) =>
            setCourses((prev) => prev.filter((c) => c.id !== deletedId))
          }
          onUpdate={(updatedCourse) =>
            setCourses((prev) =>
              prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
            )
          }
        />
      )}
    </div>
  );
};

export default ManageCourses;
