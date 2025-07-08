import { Link } from 'react-router-dom';
import smartedLogo from '../../assets/smarted-logo.png';
import { useTranslation } from 'react-i18next';

export default function StudentHome() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-100 text-white flex flex-col items-center justify-center px-4">
      <img src={smartedLogo} alt="SmartEd Logo" className="w-32 h-32 mb-6" />

      <h1 className="text-4xl font-bold mb-2 text-center">{t('welcome')}</h1>
      <p className="text-lg text-gray-300 mb-6 text-center max-w-xl">
        {t('student_home_intro')}
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Link to="/student/courses" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded shadow-md text-center">
          📚 {t('courses')}
        </Link>
        <Link to="/student/mentorship" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded shadow-md text-center">
          🤝 {t('mentorship')}
        </Link>
        <Link to="/student/community" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded shadow-md text-center">
          💬 {t('community')}
        </Link>
        <Link to="/student/library" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded shadow-md text-center">
          📚 {t('library')}
        </Link>
      </div>
    </div>
  );
}
