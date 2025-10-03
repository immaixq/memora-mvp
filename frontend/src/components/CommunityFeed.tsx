import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Clock, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { communitiesApi, CommunityWithStats, Prompt } from '@/lib/api';
import PromptCard from './PromptCard';
import LoadingSpinner from './LoadingSpinner';
import QuickCreateMemory from './QuickCreateMemory';
import toast from 'react-hot-toast';

type SortOption = 'recent' | 'trending';

const CommunityFeed = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<CommunityWithStats | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortOption>('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCommunity = async () => {
    if (!slug) return;
    
    try {
      const response = await communitiesApi.getCommunity(slug);
      setCommunity(response.data);
    } catch (error) {
      console.error('Error fetching community:', error);
      toast.error('Community not found');
      navigate('/');
    }
  };

  const fetchPrompts = async (reset = false) => {
    if (!slug) return;
    
    try {
      const currentPage = reset ? 1 : page;
      const response = await communitiesApi.getCommunityPrompts(slug, {
        sort: sorting,
        page: currentPage,
        limit: 20,
      });
      
      const newPrompts = response.data.prompts;
      
      if (reset) {
        setPrompts(newPrompts);
        setPage(2);
      } else {
        setPrompts(prev => [...prev, ...newPrompts]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newPrompts.length === 20);
    } catch (error) {
      console.error('Error fetching community prompts:', error);
      toast.error('Failed to load community prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchCommunity();
      fetchPrompts(true);
    }
  }, [slug, sorting]);

  const handleSortChange = (newSort: SortOption) => {
    setSorting(newSort);
    setPage(1);
  };

  if (loading && !community) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!community) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-16 text-center"
      >
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community not found</h2>
        <p className="text-gray-600 mb-6">The community you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="btn btn-primary inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Community Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl shadow-playful border-2 border-primary-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="text-gray-500 hover:text-primary-600 flex items-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to feed</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-playful">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{community.name}</h1>
              <p className="text-gray-600">
                {community._count.prompts} {community._count.prompts === 1 ? 'memory' : 'memories'} shared
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
            <p className="text-sm text-gray-700">
              Welcome to the <strong>{community.name}</strong> community! Share your favorite memories, 
              places, and moments that bring back nostalgia with your group.
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSortChange('recent')}
              className={`btn flex items-center space-x-2 ${
                sorting === 'recent' 
                  ? 'btn-primary' 
                  : 'btn-outline border-gray-300 text-gray-600 hover:text-primary-600'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Recent</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSortChange('trending')}
              className={`btn flex items-center space-x-2 ${
                sorting === 'trending' 
                  ? 'btn-primary' 
                  : 'btn-outline border-gray-300 text-gray-600 hover:text-primary-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </motion.button>
          </div>
        </div>
        
        {/* Quick Create Memory Input */}
        <QuickCreateMemory 
          communityId={community.id}
          onSuccess={() => fetchPrompts(true)}
        />
      </motion.div>

      {/* Prompts Feed */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {prompts.map((prompt) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <PromptCard prompt={prompt} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {prompts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No memories yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to share a memory in the {community.name} community!
          </p>
        </motion.div>
      )}

      {/* Load More */}
      {hasMore && !loading && prompts.length > 0 && (
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchPrompts()}
            className="btn btn-outline"
          >
            Load More
          </motion.button>
        </div>
      )}

      {loading && prompts.length > 0 && (
        <div className="flex justify-center mt-8">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;