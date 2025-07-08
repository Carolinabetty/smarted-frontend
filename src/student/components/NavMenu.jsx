import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NavMenu() {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { name: 'home', path: '/student' },
    { name: 'courses', path: '/student/courses' },
    { name: 'mentorship', path: '/student/mentorship' },
    { name: 'community', path: '/student/community' },
    { name: 'library', path: '/student/library' }
  ];

  return (
    <nav className="bg-gradient-to-b from-[#0A1A2F] to-[#1B2C40] text-gray-200 px-4 py-2 shadow-sm">
      <div className="flex space-x-6 justify-center">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
              location.pathname === item.path ||
              (item.path === '/student' && location.pathname === '/student')
                ? 'bg-[#32465A] text-white font-semibold shadow-inner'
                : 'hover:bg-[#25394f] hover:text-white'
            }`}
          >
            {t(item.name)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
