import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-14 h-7', 
    lg: 'w-16 h-8'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`${sizeClasses[size]} relative rounded-full p-1 transition-all duration-300 ${
        darkMode 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className={`${sizeClasses[size]} absolute inset-1 bg-white rounded-full shadow-md flex items-center justify-center`}
        initial={false}
        animate={{
          x: darkMode ? '100%' : '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: darkMode ? 180 : 0,
            scale: darkMode ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {darkMode ? (
            <Moon className={`${iconSizes[size]} text-purple-600`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-orange-500`} />
          )}
        </motion.div>
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <motion.div
          initial={false}
          animate={{
            opacity: darkMode ? 0 : 1,
            scale: darkMode ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Sun className={`${iconSizes[size]} text-white`} />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: darkMode ? 1 : 0,
            scale: darkMode ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <Moon className={`${iconSizes[size]} text-white`} />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default DarkModeToggle;