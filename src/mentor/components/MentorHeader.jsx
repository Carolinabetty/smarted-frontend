// src/mentor/components/MentorHeader.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/smarted-logo.png';
import { supabase } from '../../supabaseClient';

const MentorHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-700 text-white p-4 shadow-md relative z-50">
      <div className="flex justify-between items-center">
        {/* 👇 LOGO + TEXT */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="SmartEd Logo" className="h-10 w-auto" />
          <span className="text-xl font-semibold tracking-wide">SmartEd Mentor</span>
        </div>

        {/* 👤 PROFILE ICON + DROPDOWN */}
        <div className="relative">
          <button onClick={toggleDropdown} className="focus:outline-none">
            <FaUserCircle size={32} className="text-white" />
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

export default MentorHeader;
