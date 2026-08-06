import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiUsers, FiMessageSquare, FiTrendingUp,
  FiZap, FiShield, FiGlobe, FiArrowRight, FiStar,
  FiPlay, FiMenu, FiX
} from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <FiUsers size={32} />, title: 'Team Collaboration', description: 'Work seamlessly with your team in real-time workspaces with role-based access control', color: 'from-blue-500 to-blue-600' },
    { icon: <FiMessageSquare size={32} />, title: 'Instant Messaging', description: 'Chat instantly with emoji support, file sharing, typing indicators and read receipts', color: 'from-purple-500 to-purple-600' },
    { icon: <FiCheckCircle size={32} />, title: 'Task Management', description: 'Kanban boards, task priorities, due dates, assignments and progress tracking', color: 'from-green-500 to-green-600' },
    { icon: <FiTrendingUp size={32} />, title: 'Analytics Dashboard', description: 'Real-time insights on team productivity with beautiful charts and metrics', color: 'from-orange-500 to-orange-600' },
    { icon: <FiZap size={32} />, title: 'Real-time Updates', description: 'Instant sync across all devices using Socket.IO for zero-latency collaboration', color: 'from-yellow-500 to-yellow-600' },
    { icon: <FiShield size={32} />, title: 'Enterprise Security', description: 'JWT authentication, bcrypt encryption and role-based access control', color: 'from-red-500 to-red-600' },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Tasks Completed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Product Manager at TechCorp', avatar: 'https://i.pravatar.cc/150?img=1', text: 'CollabHub transformed how our team works. The real-time features are incredibly smooth and the UI is beautiful!' },
    { name: 'Mike Chen', role: 'CTO at StartupXYZ', avatar: 'https://i.pravatar.cc/150?img=3', text: 'Best collaboration tool we have used. The Kanban board and analytics dashboard are exactly what we needed.' },
    { name: 'Emma Wilson', role: 'Team Lead at DesignCo', avatar: 'https://i.pravatar.cc/150?img=5', text: 'The dark mode and responsive design make it perfect for our remote team spread across different time zones.' },
  ];

  const plans = [
    { name: 'Starter', price: 'Free', features: ['5 Team Members', '3 Workspaces', 'Basic Analytics', '1GB Storage'], color: 'border-gray-200', popular: false },
    { name: 'Pro', price: '$12', features: ['25 Team Members', 'Unlimited Workspaces', 'Advanced Analytics', '50GB Storage', 'Priority Support'], color: 'border-blue-500', popular: true },
    { name: 'Enterprise', price: '$49', features: ['Unlimited Members', 'Unlimited Workspaces', 'Custom Analytics', 'Unlimited Storage', '24/7 Support', 'Custom Integrations'], color: 'border-purple-500', popular: false },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className={"fixed w-full z-50 transition-all duration-300 " + (scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiGlobe className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CollabHub</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'About'].map(item => (
                <button key={item} className="text-gray-600 hover:text-blue-600 font-medium transition">{item}</button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">Login</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-semibold transition">
                  Get Started Free
                </Link>
              </motion.div>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t shadow-lg px-4 py-6 space-y-4">
            {['Features', 'Pricing', 'About'].map(item => (
              <button key={item} className="block text-gray-600 font-medium py-2">{item}</button>
            ))}
            <Link to="/login" className="block text-gray-700 font-medium py-2">Login</Link>
            <Link to="/register" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold">
              Get Started Free
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <FiZap size={16} />
              <span>Real-time Collaboration Platform</span>
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Collaborate Smarter,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Work Faster
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            The all-in-one platform for modern teams. Real-time messaging, task management,
            file sharing and analytics — all in one beautiful workspace.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl transition-all">
              <span>Start For Free</span>
              <FiArrowRight size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-8 py-4 bg-white text-gray-800 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <FiPlay size={20} className="text-blue-600" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-5xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="flex-1 mx-4 bg-gray-700 rounded h-6 flex items-center px-3">
                  <span className="text-gray-400 text-xs">https://collabhub.app/dashboard</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Tasks', value: '45', color: 'bg-blue-500' },
                    { label: 'Completed', value: '32', color: 'bg-green-500' },
                    { label: 'Team Members', value: '12', color: 'bg-purple-500' },
                    { label: 'Messages', value: '234', color: 'bg-pink-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-md">
                      <div className={"w-8 h-8 " + stat.color + " rounded-lg mb-2"} />
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white rounded-xl p-4 shadow-md h-32">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Weekly Activity</p>
                    <div className="flex items-end space-x-2 h-16">
                      {[40, 65, 45, 80, 70, 30, 55].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t" style={{ height: h + '%' }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md h-32">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Tasks</p>
                    <div className="space-y-2">
                      {[{ label: 'Done', w: '70%', color: 'bg-green-400' }, { label: 'Progress', w: '20%', color: 'bg-blue-400' }, { label: 'Todo', w: '10%', color: 'bg-gray-300' }].map((item, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-100 rounded-full h-2">
                            <div className={"h-2 rounded-full " + item.color} style={{ width: item.w }} />
                          </div>
                          <span className="text-xs text-gray-500">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <p className="text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed for modern teams to collaborate effectively</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                <div className={"w-14 h-14 bg-gradient-to-br " + feature.color + " rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg"}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">Loved by Teams</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={"bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 " + (activeTestimonial === i ? "border-blue-400 shadow-blue-100" : "border-transparent")}>
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <FiStar key={s} className="text-yellow-400 fill-current" size={18} />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center space-x-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full ring-2 ring-blue-100" />
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Start free, scale as you grow</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={"relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 " + plan.color}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">Most Popular</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Free' && <span className="text-gray-500 ml-1">/month</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center space-x-3">
                      <FiCheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/register')}
                  className={"w-full py-3.5 rounded-xl font-semibold transition " +
                    (plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50")}>
                  {plan.price === 'Free' ? 'Get Started' : 'Start Free Trial'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Transform Your Team?</h2>
            <p className="text-xl text-blue-100 mb-10">Join thousands of teams already collaborating on CollabHub</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-2xl hover:shadow-2xl transition">
                <span>Start Free Today</span>
                <FiArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiGlobe className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold text-white">CollabHub</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">The modern collaboration platform for ambitious teams. Built with cutting-edge technology for seamless real-time collaboration.</p>
              <div className="flex space-x-3">
                {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                  <button key={s} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium transition">{s}</button>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'API Docs'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2 text-sm">
                  {col.links.map((link, li) => (
                    <li key={li}><button className="hover:text-white transition">{link}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">© 2024 CollabHub. All rights reserved. Built with ❤️ by Ankit Rajput</p>
            <div className="flex space-x-6 text-sm mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map(item => (
                <button key={item} className="hover:text-white transition">{item}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
