// src/mentor/components/MentorNavBar.jsx
import { NavLink } from 'react-router-dom';

const linkBase = 'font-medium px-3 py-1 rounded transition';
const activeClass = 'bg-emerald-300 text-emerald-900';
const inactiveClass = 'text-emerald-800 hover:text-emerald-700';

const MentorNavBar = () => {
  return (
    <nav className="bg-emerald-100 px-6 py-3 shadow-sm border-b flex justify-center space-x-6">
      <NavLink
        to="/mentor"
        end
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/mentor/dashboard"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/mentor/requests"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Requests
      </NavLink>
      <NavLink
        to="/mentor/share-resources"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Share
      </NavLink>
      <NavLink
        to="/mentor/community"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Community
      </NavLink>
      <NavLink
        to="/mentor/library"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Library
      </NavLink>
    </nav>
  );
};

export default MentorNavBar;
