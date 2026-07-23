import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff, FiGlobe, FiCheck } from 'react-icons/fi';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (pass) => {
    if (pass.length < 6) return { strength: 'weak', color: 'red', width: '33%' };
    if (pass.length < 10) return { strength: 'medium', color: 'yellow', width: '66%' };
    return { strength: 'strong', color: 'green', width: '100%' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, confirmPassword);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white mb-2">
            <FiGlobe size={40} />
            <span className="text-3xl font-bold">CollabHub</span>
          </Link>
          <p className="text-pink-100">Start your journey with us today!</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${strength.color}-500 transition-all duration-300`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <span className={`text-xs font-semibold text-${strength.color}-600 capitalize`}>
                      {strength.strength}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <FiCheck className="absolute right-12 top-3.5 text-green-500" size={20} />
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 text-purple-600 rounded focus:ring-purple-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-white/80 hover:text-white text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
