import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      return
    }

    const user = signInData.user

    if (!user) {
      setError('No user returned from sign-in.')
      return
    }

    // Fetch user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      setError('Could not fetch user role.')
      return
    }

    // Navigate by role
    switch (profile.role) {
      case 'student':
        navigate('/student')
        break
      case 'educator':
        navigate('/educator')
        break
      case 'mentor':
        navigate('/mentor')
        break
      default:
        navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>

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

      {error && <p className="text-red-400 mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        className="bg-gradient-to-r from-blue-950 to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        Log In
      </button>
    </div>
  )
}
