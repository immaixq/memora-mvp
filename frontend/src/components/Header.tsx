import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus, LogOut, User, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/firebase';
import toast from 'react-hot-toast';
import CreateMemoryModal from './CreateMemoryModal';

const Header = () => {
  const { user } = useAuth();
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
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 max-w-2xl">
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

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
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

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
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
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.displayName || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
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