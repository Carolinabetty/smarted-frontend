import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');

    const sanitizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = data?.user?.id;

    if (userId) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        role: role,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // ✅ Redirect user to correct dashboard
      if (role === 'student') {
        navigate('/student');
      } else if (role === 'educator') {
        navigate('/educator');
      } else if (role === 'mentor') {
        navigate('/mentor'); // ✅ Fixed redirection path
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h2 className="text-3xl font-bold mb-6">Create an Account</h2>

      <input
        type="text"
        placeholder="First Name"
        className="mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white w-72"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Last Name"
        className="mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white w-72"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white w-72"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white w-72"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white w-72"
      >
        <option value="student">Student</option>
        <option value="educator">Educator</option>
        <option value="mentor">Mentor</option>
      </select>

      {error && <p className="text-red-400 mb-2">{error}</p>}

      <button
        onClick={handleRegister}
        className="bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-600 hover:to-gray-400 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        Register
      </button>
    </div>
  );
}
