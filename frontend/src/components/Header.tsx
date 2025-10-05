import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus, LogOut, User, Users, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/firebase';
import toast from 'react-hot-toast';
import CreateMemoryModal from './CreateMemoryModal';
import { useDarkMode } from '@/hooks/useDarkMode';

const Header = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <header className="bg-white/80 dark:bg-[#161b22]/95 backdrop-blur-md border-b border-gray-200/50 dark:border-[#30363d] sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/" 
                className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-playful group-hover:shadow-playful-lg transition-all duration-300 floating-element">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl gradient-text">Memora</span>
              </Link>
            </motion.div>

            <div className="flex items-center space-x-3">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-3">
                
                <motion.button
                  whileHover={{ scale: 1.05, rotateZ: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary flex items-center space-x-2 shadow-playful hover:shadow-playful-lg"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                  <span>Create Memory</span>
                </motion.button>

                <Link to="/communities">
                  <motion.button
                    whileHover={{ scale: 1.05, rotateZ: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline flex items-center space-x-2 shadow-playful hover:shadow-playful-lg border-2 border-primary-200"
                  >
                    <motion.div
                      whileHover={{ rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Users className="w-4 h-4" />
                    </motion.div>
                    <span>Communities</span>
                  </motion.button>
                </Link>
              </div>
              
              {/* Mobile Navigation */}
              <div className="md:hidden">
                <motion.button
                  whileHover={{ scale: 1.05, rotateZ: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary p-2.5 shadow-playful hover:shadow-playful-lg"
                  aria-label="Create Memory"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#30363d] transition-all duration-200"
                  aria-label="User menu"
                >
                  {user?.photoURL ? (
                    <motion.img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-10 h-10 rounded-full border-2 border-primary-200 shadow-sm"
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-playful"
                      whileHover={{ rotateY: 180, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#21262d] rounded-xl shadow-xl border border-gray-200 dark:border-[#30363d] py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-[#30363d]">
                      <p className="text-sm font-medium text-gray-900 dark:text-[#f0f6fc]">
                        {user?.displayName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-[#7d8590] truncate">{user?.email}</p>
                    </div>
                    
                    {/* Theme Toggle */}
                    <button
                      onClick={toggleDarkMode}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-[#f0f6fc] hover:bg-gray-100 dark:hover:bg-[#30363d] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-5 h-5">
                          {darkMode ? (
                            <Sun className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Moon className="w-4 h-4 text-gray-600 dark:text-[#7d8590]" />
                          )}
                        </div>
                        <span>Switch to {darkMode ? 'Light' : 'Dark'} Mode</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full transition-colors ${
                        darkMode ? 'bg-primary-500' : 'bg-gray-300'
                      } relative`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                          darkMode ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-[#30363d] my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-[#f0f6fc] hover:bg-gray-100 dark:hover:bg-[#30363d] flex items-center space-x-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <CreateMemoryModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </>
  );
};

export default Header;