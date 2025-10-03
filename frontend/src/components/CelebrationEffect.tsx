import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationEffectProps {
  isVisible: boolean;
  onComplete: () => void;
  type?: 'confetti' | 'hearts' | 'stars' | 'sparkles';
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  isVisible,
  onComplete,
  type = 'confetti'
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getEmoji = () => {
    switch (type) {
      case 'hearts': return '💖';
      case 'stars': return '⭐';
      case 'sparkles': return '✨';
      default: return '🎉';
    }
  };

  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {particles.map((particle) => (
            <motion.div
              key={particle}
              className="absolute text-2xl"
              initial={{
                x: '50vw',
                y: '50vh',
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1.5, 1, 0],
                rotate: Math.random() * 360,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 2,
                ease: [0.23, 1, 0.32, 1],
                delay: Math.random() * 0.5,
              }}
            >
              {getEmoji()}
            </motion.div>
          ))}
          
          {/* Center burst */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.2, 1, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ scale: 0 }}
            transition={{
              duration: 1.5,
              ease: "easeOut"
            }}
          >
            {type === 'confetti' ? '🎊' : getEmoji()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationEffect;