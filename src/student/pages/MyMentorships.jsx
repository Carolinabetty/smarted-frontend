import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const MyMentorships = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Could not retrieve user.');
        setLoading(false);
        return;
      }

      const { data, error: sessionError } = await supabase
        .from('sessions')
        .select(`
          id,
          topic,
          scheduled_at,
          status,
          mentor_id,
          profiles!sessions_mentor_id_fkey (first_name, last_name)
        `)
        .eq('mentee_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (sessionError) {
        setError(sessionError.message);
      } else {
        setSessions(data);
      }

      setLoading(false);
    };

    fetchSessions();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-700">My Mentorship Sessions</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-700">No mentorship sessions yet.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li key={session.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800">
                    Mentor: {session.profiles?.first_name} {session.profiles?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">Topic: {session.topic}</p>
                  <p className="text-sm text-gray-600">
                    Scheduled: {new Date(session.scheduled_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Status: {session.status}</p>
                </div>

                {session.status === 'scheduled' && (
                  <Link to={`/student/session/${session.id}`}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">
                      Join Session
                    </button>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyMentorships;
