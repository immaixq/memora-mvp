import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import CelebrationEffect from './CelebrationEffect';

const AchievementNotification = () => {
  const { newlyUnlocked } = useGamification();
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(0);

  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      setShowCelebration(true);
      setCurrentAchievement(0);
    }
  }, [newlyUnlocked]);

  const handleNext = () => {
    if (currentAchievement < newlyUnlocked.length - 1) {
      setCurrentAchievement(currentAchievement + 1);
    }
  };

  const handleClose = () => {
    setShowCelebration(false);
    setCurrentAchievement(0);
  };

  const currentUnlock = newlyUnlocked[currentAchievement];

  return (
    <>
      <AnimatePresence>
        {currentUnlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 animate-pulse" />
                <motion.div
                  initial={{ rotate: 0, scale: 1 }}
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                  className="relative"
                >
                  <Trophy className="w-16 h-16 text-white mx-auto mb-2" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Achievement Unlocked!</h2>
              </div>

              {/* Badge Display */}
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4"
                >
                  <div className={`
                    w-24 h-24 rounded-2xl flex items-center justify-center text-4xl
                    bg-gradient-to-br shadow-2xl
                    ${currentUnlock.badge.rarity === 'legendary' ? 'from-yellow-400 to-orange-500 shadow-yellow-300' :
                      currentUnlock.badge.rarity === 'epic' ? 'from-purple-500 to-pink-500 shadow-purple-300' :
                      currentUnlock.badge.rarity === 'rare' ? 'from-blue-400 to-blue-600 shadow-blue-200' :
                      'from-gray-400 to-gray-500 shadow-gray-200'
                    }
                  `}>
                    {currentUnlock.badge.emoji}
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-bold text-gray-900 mb-2"
                >
                  {currentUnlock.badge.name}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 mb-4"
                >
                  {currentUnlock.badge.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-3 mb-6"
                >
                  <p className="text-sm font-medium text-primary-800">
                    {currentUnlock.message}
                  </p>
                </motion.div>

                {/* Actions */}
                <div className="flex space-x-3">
                  {currentAchievement < newlyUnlocked.length - 1 ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="flex-1 btn btn-outline"
                      >
                        Skip
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className="flex-1 btn btn-primary"
                      >
                        Next ({currentAchievement + 1}/{newlyUnlocked.length})
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClose}
                      className="w-full btn btn-primary"
                    >
                      Awesome! 🎉
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CelebrationEffect
        isVisible={showCelebration && !!currentUnlock}
        onComplete={() => {}}
        type={currentUnlock?.badge.rarity === 'legendary' ? 'stars' : 'confetti'}
      />
    </>
  );
};

export default AchievementNotification;