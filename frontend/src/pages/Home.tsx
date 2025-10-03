import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock } from 'lucide-react';
import { promptsApi, Prompt } from '@/lib/api';
import PromptCard from '@/components/PromptCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import QuickCreateMemory from '@/components/QuickCreateMemory';
import toast from 'react-hot-toast';

const Home = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'trending'>('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPrompts = async (pageNum: number = 1, sort: 'recent' | 'trending' = 'recent') => {
    try {
      const { data } = await promptsApi.getPrompts({
        sort,
        page: pageNum,
        limit: 10,
      });

      if (pageNum === 1) {
        setPrompts(data.prompts);
      } else {
        setPrompts(prev => [...prev, ...data.prompts]);
      }

      setHasMore(pageNum < data.pagination.pages);
    } catch (error: any) {
      console.error('Error fetching prompts:', error);
      toast.error('Failed to load prompts');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPrompts(1, sortBy).finally(() => setLoading(false));
    setPage(1);
  }, [sortBy]);

  const handleSortChange = (newSort: 'recent' | 'trending') => {
    setSortBy(newSort);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchPrompts(nextPage, sortBy);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const handlePromptUpdate = () => {
    // Refresh prompts when a new one is created
    fetchPrompts(1, sortBy);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 relative"
      >
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-4 left-1/4 w-3 h-3 bg-primary-300 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-8 right-1/4 w-2 h-2 bg-secondary-400 rounded-full"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute bottom-4 left-1/3 w-4 h-4 bg-accent-300 rounded-full"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.h1 
          className="text-4xl font-bold gradient-text mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          Welcome to Memora
        </motion.h1>
        <motion.p 
          className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          🌟 Share your favorite places, nostalgic memories, and hidden gems with your community. 
          💫 Discover what others love and engage through responses and polls.
        </motion.p>
        
        {/* Fun stats or CTAs could go here */}
        <motion.div
          className="flex justify-center space-x-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">✨</div>
            <div className="text-sm text-gray-500">Share memories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600">🗳️</div>
            <div className="text-sm text-gray-500">Vote on polls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-600">💬</div>
            <div className="text-sm text-gray-500">Join conversations</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Sort Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border-2 border-gray-100 w-fit mx-auto shadow-playful"
      >
        <motion.button
          onClick={() => handleSortChange('recent')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            sortBy === 'recent'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-playful'
              : 'text-gray-600 hover:text-gray-900 hover:bg-primary-50'
          }`}
        >
          <motion.div
            animate={sortBy === 'recent' ? { rotate: 360 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Clock className="w-4 h-4" />
          </motion.div>
          <span>Recent</span>
        </motion.button>
        <motion.button
          onClick={() => handleSortChange('trending')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            sortBy === 'trending'
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-accent-900 shadow-playful'
              : 'text-gray-600 hover:text-gray-900 hover:bg-accent-50'
          }`}
        >
          <motion.div
            animate={sortBy === 'trending' ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: sortBy === 'trending' ? Infinity : 0, repeatDelay: 2 }}
          >
            <TrendingUp className="w-4 h-4" />
          </motion.div>
          <span>Trending</span>
        </motion.button>
      </motion.div>

      {/* Quick Create Memory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <QuickCreateMemory onSuccess={handlePromptUpdate} />
      </motion.div>

      {/* Prompts Feed */}
      <div className="space-y-6">
        {prompts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No prompts yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Be the first to share something with your community!
            </p>
          </motion.div>
        ) : (
          prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PromptCard prompt={prompt} onUpdate={handlePromptUpdate} />
            </motion.div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && prompts.length > 0 && (
        <div className="flex justify-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn btn-outline flex items-center space-x-2"
          >
            {loadingMore && <LoadingSpinner size="sm" />}
            <span>{loadingMore ? 'Loading...' : 'Load More'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;