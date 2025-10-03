import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { promptsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface QuickCreateMemoryProps {
  communityId?: string;
  onSuccess?: () => void;
}

const QuickCreateMemory: React.FC<QuickCreateMemoryProps> = ({ 
  communityId, 
  onSuccess 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { incrementPromptsCreated } = useGamification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await promptsApi.createPrompt({
        title: title.trim(),
        type: 'TEXT',
        communityId,
      });

      // Track gamification
      incrementPromptsCreated();
      
      toast.success('Memory shared! ✨');
      setTitle('');
      setIsExpanded(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating memory:', error);
      toast.error('Failed to share memory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTitle('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {!isExpanded ? (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExpand}
          className="w-full bg-white rounded-2xl shadow-playful border-2 border-primary-100 p-4 text-left hover:border-primary-300 hover:shadow-playful-lg transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-playful group-hover:shadow-playful-lg"
            >
              <Plus className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <p className="text-gray-900 font-medium">Share a memory...</p>
              <p className="text-gray-500 text-sm">What's your favorite memory from this community?</p>
            </div>
            <motion.div
              className="ml-auto text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.1 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-playful-lg border-2 border-primary-200 p-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Share your favorite memory, place, or moment from this community..."
                className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                rows={3}
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-between">
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={!title.trim() || isLoading}
                whileHover={title.trim() && !isLoading ? { scale: 1.05 } : {}}
                whileTap={title.trim() && !isLoading ? { scale: 0.95 } : {}}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  title.trim() && !isLoading
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-playful hover:shadow-playful-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Sharing...' : 'Share Memory'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuickCreateMemory;