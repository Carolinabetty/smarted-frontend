import React from 'react';

const CourseCard = ({ course, onEnroll }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md text-white">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="text-xl font-bold mb-1">{course.title}</h3>
      <p className="text-gray-400 text-sm mb-2">{course.description}</p>
      <p className="text-sm text-blue-400 mb-2">Category: {course.category}</p>

      {course.enrolled ? (
        <>
          <div className="text-green-400 font-semibold mb-2">✅ Enrolled</div>
          {course.progress && (
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => onEnroll(course)}
          className="bg-blue-600 px-4 py-2 rounded-lg mt-2 hover:bg-blue-500"
        >
          Enroll
        </button>
      )}
    </div>
  );
};

export default CourseCard;
