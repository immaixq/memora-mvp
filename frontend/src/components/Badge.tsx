import { motion } from 'framer-motion';

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

interface BadgeProps {
  badge: BadgeData;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  badge, 
  size = 'md', 
  showTooltip = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-500 to-pink-500',
    legendary: 'from-yellow-400 to-orange-500',
  };

  const rarityGlow = {
    common: 'shadow-sm',
    rare: 'shadow-blue-200 shadow-md',
    epic: 'shadow-purple-300 shadow-lg',
    legendary: 'shadow-yellow-300 shadow-xl',
  };

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`
          ${sizeClasses[size]}
          ${badge.unlocked 
            ? `bg-gradient-to-br ${rarityColors[badge.rarity]} ${rarityGlow[badge.rarity]}` 
            : 'bg-gray-200'
          }
          rounded-xl flex items-center justify-center transition-all duration-300
          ${badge.unlocked ? 'hover:brightness-110' : 'filter grayscale opacity-50'}
        `}
        animate={badge.unlocked ? {
          rotate: [0, -5, 5, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <span className={badge.unlocked ? '' : 'filter grayscale opacity-60'}>
          {badge.emoji}
        </span>
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          <div className="font-semibold">{badge.name}</div>
          <div className="text-gray-300 text-xs">{badge.description}</div>
          {badge.unlocked && badge.unlockedAt && (
            <div className="text-gray-400 text-xs mt-1">
              Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
            </div>
          )}
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </motion.div>
      )}

      {/* Unlock animation overlay */}
      {badge.unlocked && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/30 to-orange-500/30"
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
      )}
    </motion.div>
  );
};

export default Badge;