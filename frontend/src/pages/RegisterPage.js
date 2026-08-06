import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff, FiGlobe, FiArrowRight, FiCheck } from 'react-icons/fi';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 25, label: 'Weak', color: 'bg-red-500' },
      { strength: 50, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 75, label: 'Good', color: 'bg-blue-500' },
      { strength: 100, label: 'Strong', color: 'bg-green-500' },
    ];
    return levels[score];
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!agreed) { setError('Please agree to the Terms of Service'); return; }
    setLoading(true);
    const result = await register(name, email, password, confirmPassword);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-white rounded-full" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Join CollabHub</h2>
          <p className="text-pink-100 text-lg mb-8">Create your free account and start collaborating today</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { emoji: '🚀', title: 'Free Forever', desc: 'Start free, upgrade anytime' },
              { emoji: '⚡', title: 'Real-time', desc: 'Instant updates for your team' },
              { emoji: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
              { emoji: '📊', title: 'Analytics', desc: 'Track team productivity' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="font-bold">{item.title}</p>
                <p className="text-pink-100 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FiGlobe className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CollabHub</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 mb-8">Join thousands of teams using CollabHub</p>

            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start space-x-3">
                <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <span className="text-red-800 text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition text-gray-800"
                    placeholder="John Doe" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition text-gray-800"
                    placeholder="your@email.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition text-gray-800"
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: strength.strength + '%' }}
                          className={"h-full rounded-full transition-all " + strength.color} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-12">{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password"
                    className={"w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:outline-none transition text-gray-800 " + (confirmPassword && password === confirmPassword ? "border-green-500 focus:border-green-500" : "border-gray-200 focus:border-purple-500")}
                    placeholder="••••••••" required />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {confirmPassword && password === confirmPassword && <FiCheck className="text-green-500" size={18} />}
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-600">
                      {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-1 text-purple-600 rounded" />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold">Privacy Policy</button>
                </label>
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
