import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const RequestMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'mentor');

      if (error) {
        console.error('Error fetching mentors:', error.message);
      } else {
        setMentors(data);
      }
    };

    fetchMentors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('User not logged in.');
      return;
    }

    if (!selectedMentor || !topic || !scheduledAt) {
      setError('Please fill in all fields.');
      return;
    }

    const { error: insertError } = await supabase.from('sessions').insert({
      mentor_id: selectedMentor,
      mentee_id: user.id,
      topic,
      scheduled_at: scheduledAt,
      status: 'pending',
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate('/student/mentorship/sessions');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-700">Request a Mentorship Session</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Select Mentor</label>
          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">-- Choose Mentor --</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.first_name} {mentor.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Study Strategies, Career Guidance"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestMentor;
