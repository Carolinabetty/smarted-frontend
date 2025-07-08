import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import NavMenu from "./components/NavMenu";
import SearchBar from "./components/SearchBar";
import Footer from "./components/Footer";

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New assignment posted', read: false },
    { id: 2, text: 'Course update available', read: false }
  ]);
  const [userProfile] = useState({
    name: 'Student User',
    email: 'student@smarted.com',
    avatar: ''
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onClearAll={clearAllNotifications}
        userProfile={userProfile}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Horizontal NavMenu and SearchBar stacked vertically */}
      <div className="bg-gray-100 border-b border-gray-200">
        <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="px-4 py-2">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
