import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FaUserCircle } from 'react-icons/fa';
import { MdPendingActions, MdDone, MdClose, MdCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const mockMentors = [
  {
    id: 'mock-1',
    full_name: 'Dr. Amina Mwangi',
    field: 'Data Science',
    bio: 'AI mentor based in Nairobi.',
    is_online: true,
  },
  {
    id: 'mock-2',
    full_name: 'Prof. Kevin Otieno',
    field: 'Software Engineering',
    bio: 'Backend and DevOps expert.',
    is_online: false,
  },
];

const Mentorship = () => {
  const { t } = useTranslation();
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMentors = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, field, bio, is_online')
        .eq('role', 'mentor');

      setMentors(data?.length ? data : mockMentors);
    };

    const fetchRequests = async () => {
      const { data } = await supabase
        .from('mentorship_requests')
        .select('id, mentor_id, status')
        .eq('student_id', userId);

      if (data) setRequests(data);
    };

    fetchMentors();
    fetchRequests();

    const channel = supabase
      .channel('mentorship-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentorship_requests',
          filter: `student_id=eq.${userId}`,
        },
        () => fetchRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleRequest = async (mentorId) => {
    const alreadyRequested = requests.some((r) => r.mentor_id === mentorId);
    if (alreadyRequested) {
      alert(t('already_requested'));
      return;
    }

    const { error } = await supabase.from('mentorship_requests').insert([
      {
        student_id: userId,
        mentor_id: mentorId,
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('Request failed:', error);
      alert(t('request_failed'));
    } else {
      alert(t('request_sent'));
    }
  };

  const getStatus = (mentorId) =>
    requests.find((r) => r.mentor_id === mentorId)?.status || null;

  const statusIcon = {
    pending: <MdPendingActions className="text-yellow-400" />,
    accepted: <MdDone className="text-green-400" />,
    rejected: <MdClose className="text-red-500" />,
  };

  if (!userId) {
    return (
      <div className="text-center text-white mt-20">
        <p className="text-xl">{t('login_required')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{t('mentorship_portal')}</h1>
      <p className="text-gray-400 mb-8">{t('mentorship_intro')}</p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-white mb-2">{t('mentor_resources')}</h3>
          <p className="text-sm text-emerald-100">{t('mentor_resources_desc')}</p>
          <Link
            to="/student/resource-library"
            className="inline-block mt-3 text-sm text-white underline hover:text-emerald-300"
          >
            {t('view_resources')}
          </Link>
        </div>

        <div className="bg-indigo-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-white mb-2">{t('my_sessions')}</h3>
          <p className="text-sm text-indigo-100">{t('my_sessions_desc')}</p>
          <Link
            to="/student/my-mentorships"
            className="inline-block mt-3 text-sm text-white underline hover:text-indigo-300"
          >
            {t('view_sessions')}
          </Link>
        </div>

        <div className="bg-red-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-white mb-2">{t('live_session')}</h3>
          <p className="text-sm text-red-100">{t('live_session_desc')}</p>
          <Link
            to="/student/session/123"
            className="inline-block mt-3 text-sm text-white underline hover:text-red-300"
          >
            {t('join_now')}
          </Link>
        </div>
      </div>

      {/* Mentor Cards */}
      <div className="flex flex-col gap-6">
        {mentors.map((mentor) => {
          const status = getStatus(mentor.id);
          return (
            <div
              key={mentor.id}
              className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-2">
                <FaUserCircle className="text-gray-400" size={50} />
                <div>
                  <h2 className="text-xl font-semibold">{mentor.full_name}</h2>
                  <p className="text-sm text-gray-300">{mentor.field}</p>
                  <p className="text-xs text-gray-400">{mentor.bio}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MdCircle
                      size={10}
                      className={mentor.is_online ? 'text-green-400' : 'text-red-500'}
                    />
                    <span className="text-xs text-gray-400">
                      {mentor.is_online ? t('online_now') : t('offline')}
                    </span>
                  </div>
                </div>
              </div>

              {status ? (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span>{t('status')}:</span>
                  {statusIcon[status]}
                  <span className="capitalize text-yellow-300">{t(status)}</span>
                </div>
              ) : (
                <button
                  onClick={() => handleRequest(mentor.id)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-md"
                >
                  {t('request_mentorship')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mentorship;
