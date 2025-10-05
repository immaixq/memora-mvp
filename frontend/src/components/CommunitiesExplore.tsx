import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communitiesApi, CommunityWithStats } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import CreateCommunityModal from './CreateCommunityModal';
import toast from 'react-hot-toast';

const CommunitiesExplore = () => {
  const [communities, setCommunities] = useState<CommunityWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCommunities = async () => {
    try {
      const response = await communitiesApi.getCommunities();
      setCommunities(response.data);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommunityCreated = (newCommunity: CommunityWithStats) => {
    setCommunities(prev => [newCommunity, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl shadow-playful mx-auto mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Communities</h1>
          <p className="text-gray-600 dark:text-[#8b949e] max-w-2xl mx-auto mb-6">
            Join communities of people sharing memories, favorite places, and nostalgic moments. 
            Or create your own community for your group!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, rotateZ: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center space-x-2 mx-auto shadow-playful hover:shadow-playful-lg"
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-4 h-4" />
            </motion.div>
            <span>Create Community</span>
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#7d8590]" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </motion.div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Link to={`/communities/${community.slug}`}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.03, 
                      rotateY: 2,
                      boxShadow: '0 25px 50px rgba(139, 92, 246, 0.15)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-[#21262d] rounded-3xl shadow-playful border-2 border-primary-100 dark:border-[#30363d] p-8 transition-all duration-300 hover:border-primary-300 dark:hover:border-[#58a6ff] group relative overflow-hidden min-h-[280px] flex flex-col"
                  >
                    {/* Enhanced decorative background elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-200/40 to-secondary-200/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-accent-200/30 to-success-200/30 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-yellow-100/20 to-orange-100/20 rounded-full blur-3xl group-hover:rotate-180 transition-transform duration-1000" />
                    
                    <div className="relative flex flex-col h-full">
                      {/* Header Section */}
                      <div className="flex flex-col items-center text-center mb-6">
                        <motion.div 
                          whileHover={{ rotateY: 180, scale: 1.15 }}
                          transition={{ duration: 0.4, type: "spring" }}
                          className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-playful mb-4 group-hover:shadow-playful-lg"
                        >
                          <Users className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="w-full">
                          <h3 className={`font-bold text-gray-900 dark:text-[#f0f6fc] group-hover:text-primary-600 dark:group-hover:text-[#58a6ff] transition-colors leading-tight mb-2 ${
                            community.name.length > 25 ? 'text-lg' : 
                            community.name.length > 15 ? 'text-xl' : 'text-2xl'
                          }`}>
                            {community.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-[#7d8590] font-medium bg-gray-50 dark:bg-[#161b22] px-3 py-1 rounded-full inline-block">
                            @{community.slug}
                          </p>
                        </div>
                      </div>

                      {/* Stats Section */}
                      <div className="mt-auto">
                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-[#161b22] dark:to-[#0d1117] rounded-2xl p-4 mb-4">
                          <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-[#f0f6fc]">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            <span className="font-semibold text-lg">
                              {community._count.prompts}
                            </span>
                            <span className="text-sm">
                              {community._count.prompts === 1 ? 'memory' : 'memories'}
                            </span>
                          </div>
                        </div>
                        
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className="flex items-center justify-center text-primary-600 dark:text-[#58a6ff] group-hover:text-primary-700 dark:group-hover:text-[#79c0ff] font-bold text-lg"
                        >
                          <span>Explore Community</span>
                          <motion.span
                            whileHover={{ x: 3 }}
                            className="ml-2 text-xl"
                          >
                            →
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">
              {searchQuery ? '🔍' : '✨'}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No communities found' : 'No communities yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No communities match "${searchQuery}". Try a different search term.`
                : 'Be the first to create a community and start sharing memories with your group!'
              }
            </p>
            
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05, rotateZ: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary flex items-center space-x-2 mx-auto shadow-playful hover:shadow-playful-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Community</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      <CreateCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCommunityCreated}
      />
    </>
  );
};

export default CommunitiesExplore;