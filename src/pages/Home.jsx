import { useTranslation } from 'react-i18next'
import smartedLogo from '../assets/smarted-logo.png'
import { useNavigate } from 'react-router-dom'

export default function Home({ i18n }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-100 text-white px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <img src={smartedLogo} alt="SmartEd Logo" className="w-28 h-28 mb-6" />

        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
          SmartEd: Learn. Teach. Mentor.
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl mb-10 leading-relaxed">
          Whether you're here to level up your skills, guide others, or share your expertise —
          SmartEd connects motivated learners with passionate educators and experienced mentors.
          Join a vibrant community where growth is mutual.
        </p>

        <div className="flex space-x-6 mb-8">
  <button
    className="bg-gradient-to-r from-blue-950 to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white text-lg font-medium px-6 py-3 rounded-full transition duration-200 shadow-md"
    onClick={() => navigate('/login')}
  >
    Log In
  </button>

  <button
    className="bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-600 hover:to-gray-400 text-white text-lg font-medium px-6 py-3 rounded-full transition duration-200 shadow-md"
    onClick={() => navigate('/register')}
  >
    Register
  </button>
</div>


        <button
          className="text-sm text-gray-500 underline"
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
        >
          {t('switchLanguage')}
        </button>
      </div>
    </div>
  )
}
