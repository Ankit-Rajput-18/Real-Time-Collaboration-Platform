import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiUsers, FiMessageSquare, FiTrendingUp, FiZap, FiShield, FiGlobe } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiUsers size={32} />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team in real-time workspaces'
    },
    {
      icon: <FiMessageSquare size={32} />,
      title: 'Instant Messaging',
      description: 'Chat with team members instantly with real-time notifications'
    },
    {
      icon: <FiCheckCircle size={32} />,
      title: 'Task Management',
      description: 'Track tasks, set priorities, and monitor progress effortlessly'
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Analytics Dashboard',
      description: 'Get insights on team productivity and project progress'
    },
    {
      icon: <FiZap size={32} />,
      title: 'Real-time Updates',
      description: 'Stay in sync with live updates using Socket.IO technology'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with JWT authentication'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Tasks Completed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FiGlobe className="text-blue-600" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CollabHub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Collaborate Smarter,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Work Faster
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The all-in-one platform for team collaboration, task management, and real-time communication. 
            Built with modern technology for modern teams.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:shadow-2xl transform hover:scale-105 transition duration-200"
            >
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-gray-800 text-lg font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition duration-200">
              Watch Demo
            </button>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <FiUsers className="text-blue-600 mb-2" size={40} />
                  <p className="font-semibold">Team Spaces</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <FiMessageSquare className="text-purple-600 mb-2" size={40} />
                  <p className="font-semibold">Live Chat</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <FiCheckCircle className="text-green-600 mb-2" size={40} />
                  <p className="font-semibold">Task Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed for modern teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already collaborating on CollabHub
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:shadow-2xl transform hover:scale-105 transition duration-200"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiGlobe className="text-blue-500" size={24} />
                <span className="text-xl font-bold text-white">CollabHub</span>
              </div>
              <p className="text-sm">
                The modern collaboration platform for ambitious teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 CollabHub. All rights reserved. Built with ❤️ by Ankit Rajput</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
