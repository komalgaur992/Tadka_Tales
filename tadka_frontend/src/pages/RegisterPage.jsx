import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // dj-rest-auth registration
      await api.post('/api/auth/registration/', { email, password1, password2 })
      // After register, redirect to login
      navigate('/login', { replace: true })
    } catch (err) {
      const data = err?.response?.data
      const msg = typeof data === 'string' ? data : (data?.detail || 'Registration failed')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-soft rounded-2xl p-8"
        >
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Create account</h1>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">{error}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field w-full"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
                className="input-field w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                className="input-field w-full"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <Link className="text-primary-600 hover:underline" to="/login">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
