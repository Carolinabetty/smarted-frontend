import React, { useState } from 'react';
import CourseCard from './courses/CourseCard';

const mockCourses = [
  {
    id: 1,
    title: 'Introduction to Programming',
    description: 'Learn the basics of Python, logic, and problem-solving.',
    category: 'Programming',
    thumbnail: '/course-thumbnails/python.png',
    price: 300,
    progress: 60,
    enrolled: true,
  },
  {
    id: 2,
    title: 'Mastering Algebra',
    description: 'Strengthen your algebra skills with real examples.',
    category: 'Mathematics',
    thumbnail: '/course-thumbnails/algebra.png',
    price: 250,
    enrolled: false,
  },
  {
    id: 3,
    title: 'Creative Writing Workshop',
    description: 'Unlock your writing potential with expert guidance.',
    category: 'Languages',
    thumbnail: '/course-thumbnails/writing.png',
    price: 200,
    enrolled: false,
  },
  {
    id: 4,
    title: 'Mobile App Development',
    description: 'Build Android apps using Flutter and Dart.',
    category: 'Programming',
    thumbnail: '/course-thumbnails/flutter.png',
    price: 500,
    progress: 20,
    enrolled: true,
  },
  {
    id: 5,
    title: 'Biology Basics',
    description: 'Explore the world of living organisms.',
    category: 'Science',
    thumbnail: '/course-thumbnails/biology.png',
    price: 200,
    enrolled: false,
  },
];

const allCategories = ['All', 'Programming', 'Mathematics', 'Languages', 'Science'];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setShowPhonePrompt(false);
    setPhoneNumber('');
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowPhonePrompt(false);
    setPhoneNumber('');
  };

  const handlePay = () => {
    if (!phoneNumber) {
      alert('Please enter a valid phone number.');
      return;
    }
    alert(`✅ STK Push Simulation sent to ${phoneNumber} for KES ${selectedCourse.price}`);
    closeModal();
  };

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const inProgress = filteredCourses.filter((c) => c.enrolled && c.progress > 0);
  const recommended = filteredCourses.filter((c) => !c.enrolled).slice(0, 3);

  return (
    <div className="p-6 text-gray-100 bg-gray-900 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-4">Explore Courses</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white w-full md:w-1/2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
        >
          {allCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">In Progress</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {inProgress.map((course) => (
              <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((course) => (
              <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
            ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">All Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
          ))}
        </div>
      </div>

      {/* Enroll Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-white text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
            <p className="mb-2">{selectedCourse.description}</p>
            <p className="mb-2">📚 Category: {selectedCourse.category}</p>
            <p className="mb-2">🕒 Duration: 3 weeks</p>
            <p className="mb-4">💰 Price: KES {selectedCourse.price}</p>

            {!showPhonePrompt ? (
              <button
                onClick={() => setShowPhonePrompt(true)}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg"
              >
                Pay
              </button>
            ) : (
              <>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 rounded mt-3 mb-3 text-black"
                />
                <button
                  onClick={handlePay}
                  className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg"
                >
                  Confirm Payment
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
