import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const MentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          topic,
          scheduled_at,
          status,
          mentee_id,
          mentee_profile:profiles!fk_sessions_mentee (first_name, last_name)
        `)
        .eq('mentor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setRequests(data);
      }

      setLoading(false);
    };

    fetchRequests();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-700">Mentorship Requests</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No mentorship sessions found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-emerald-800">
                    {req.mentee_profile?.first_name} {req.mentee_profile?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Topic: <span className="font-medium">{req.topic}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Scheduled: {new Date(req.scheduled_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Status: {req.status}</p>
                </div>

                <Link to={`/mentor/session/${req.id}`}>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">
                    Open Session
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentorshipRequests;
