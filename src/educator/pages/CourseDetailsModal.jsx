import React from 'react';

const CourseDetailsModal = ({ course, onClose }) => {
  if (!course) return null;

  const isMock = course.id.startsWith('mock-');

  // Mock module data for demo courses
  const mockModules = [
    'Module 1: Getting Started',
    'Module 2: Core Content',
    'Module 3: Summary & Assessment',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">{course.title}</h2>
          <button
            className="text-gray-600 hover:text-red-500 font-bold text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Thumbnail */}
        {course.thumbnail_url && (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Category:</strong> {course.category}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Uploaded:</strong>{' '}
            {new Date(course.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Module list */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-700 mb-2">Modules</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {(isMock ? mockModules : course.modules || []).map((mod, idx) => (
              <li key={idx}>{mod}</li>
            ))}
            {(!course.modules || course.modules.length === 0) && !isMock && (
              <li className="italic text-gray-400">No modules yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;
