import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX, FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-blue-600">CollabHub</h1>
        </div>

        {user && (
          <div className="hidden md:flex items-center space-x-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l">
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && user && (
        <div className="md:hidden bg-gray-50 px-4 py-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2"
          >
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
