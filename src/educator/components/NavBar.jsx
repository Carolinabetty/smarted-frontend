import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { name: 'Home', path: '/educator', exact: true },
  { name: 'Manage Courses', path: '/educator/manage-courses' },
  { name: 'Upload Course', path: '/educator/upload-course' },
  { name: 'Student Stats', path: '/educator/student-stats' },
  { name: 'Discussion Board', path: '/educator/discussion-board' },
  { name: 'Library', path: '/educator/library' },
  { name: 'Community', path: '/educator/community' },
];

const NavBar = () => {
  return (
    <nav className="bg-blue-100 shadow-sm">
      <ul className="flex justify-around px-4 py-3">
        {links.map((link) => (
          <li key={link.name}>
            <NavLink
              to={link.path}
              end={link.exact} // 🔥 ensures 'Home' only matches exact path
              className={({ isActive }) =>
                `text-sm md:text-base font-medium px-3 py-1 rounded-md transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-blue-800 hover:bg-blue-200'
                }`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
