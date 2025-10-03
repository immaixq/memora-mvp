import { motion } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            "0 4px 20px rgba(59, 130, 246, 0.3)",
            "0 8px 30px rgba(147, 51, 234, 0.4)",
            "0 4px 20px rgba(59, 130, 246, 0.3)"
          ]
        }}
        transition={{ 
          boxShadow: { repeat: Infinity, duration: 2 },
          hover: { duration: 0.2 },
          tap: { duration: 0.1 }
        }}
        className="relative"
      >
        <Button
          onClick={onClick}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="relative z-10"
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </Button>
        
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.3, 0.7]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 -z-10"
        />
      </motion.div>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute -top-2 -right-2"
      >
        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </motion.div>
    </motion.div>
  );
}