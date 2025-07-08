import { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaBell, FaUserCircle } from 'react-icons/fa';
import smartedLogo from '../../assets/smarted-logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function Header() {
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'sw' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-l from-gray-200 via-[#1B2C40] to-[#0A1A2F] text-white p-4 flex justify-between items-center border-b border-gray-600 shadow-md relative">
      {/* Logo */}
      <div className="flex items-center bg-white p-1 rounded-md shadow-sm">
        <img src={smartedLogo} alt="SmartEd Logo" className="h-12 w-auto" />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-5 relative" ref={dropdownRef}>
        {/* 🌍 Language */}
        <button
          onClick={toggleLang}
          className="p-2 hover:bg-[#32465A] rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          aria-label="Toggle language"
        >
          <FaGlobe size={22} className="text-gray-100" />
        </button>

        {/* 🔔 Notifications */}
        <button
          className="p-2 hover:bg-[#32465A] rounded-full relative transition-colors duration-200"
          aria-label="Notifications"
        >
          <FaBell size={22} className="text-gray-100" />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-3 h-3 animate-pulse"></span>
        </button>

        {/* 👤 Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="p-2 hover:bg-[#32465A] rounded-full transition-colors duration-200"
            aria-label="User profile"
          >
            <FaUserCircle size={22} className="text-gray-100" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg z-50">
              <button
                onClick={handleUpdateProfile}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                🔄 Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                🔓 Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
