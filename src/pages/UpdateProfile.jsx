import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
  const [profile, setProfile] = useState({ full_name: '', role: '', field: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in.');
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Fetch error:', error);
        alert('Could not load profile.');
      } else {
        setProfile({
          full_name: data.full_name || '',
          role: data.role || '',
          field: data.field || '',
          bio: data.bio || '',
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('User not found.');
      return;
    }

    const updates = {
      id: user.id,
      full_name: profile.full_name,
      role: profile.role,
      field: profile.field,
      bio: profile.bio,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      console.error('Update error:', error);
      alert('Failed to update profile.');
    } else {
      alert('✅ Profile updated!');
      navigate(-1); // go back
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Role</label>
            <select
              name="role"
              value={profile.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="educator">Educator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Field</label>
            <input
              type="text"
              name="field"
              value={profile.field}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="e.g. Data Science, Biology, Literature"
            />
          </div>

          <div>
            <label className="block text-sm">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
