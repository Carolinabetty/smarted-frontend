// src/educator/components/Header.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import logo from '../../assets/smarted-logo.png';
import { supabase } from '../../supabaseClient';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm flex items-center justify-between px-6 py-4 relative z-50">
      {/* Logo and title */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="SmartEd Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-blue-800">SmartEd Educator</h1>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative text-blue-700 hover:text-blue-900">
          <FaBell className="text-2xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            3
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="text-blue-700 hover:text-blue-900">
            <FaUserCircle className="text-3xl" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-md z-50"
              onMouseLeave={closeDropdown}
            >
              <button
                onClick={() => {
                  navigate('/update-profile');
                  closeDropdown();
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
