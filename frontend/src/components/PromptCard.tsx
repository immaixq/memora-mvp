import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, BarChart3, Share2, Flag, User, Zap, Trash2, MoreVertical } from 'lucide-react';
import { Prompt, promptsApi } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import PollVoting from './PollVoting';
import ShareModal from './ShareModal';
import ChallengeModal from './ChallengeModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface PromptCardProps {
  prompt: Prompt;
  onUpdate?: () => void;
  showFullContent?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  onUpdate,
  showFullContent = false 
}) => {
  const { user } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(prompt.isLiked || false);
  const [likesCount, setLikesCount] = useState(prompt._count?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleReport = () => {
    // TODO: Implement report functionality
    toast.success('Report submitted (feature coming soon)');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await promptsApi.deletePrompt(prompt.id);
      toast.success('Memory deleted successfully');
      setShowDeleteModal(false);
      onUpdate?.(); // Refresh the feed
    } catch (error: any) {
      console.error('Error deleting memory:', error);
      toast.error('Failed to delete memory');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const wasLiked = isLiked;
    
    // Optimistic update
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
    
    try {
      const response = await promptsApi.likePrompt(prompt.id);
      // Update with server response
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error: any) {
      console.error('Error liking memory:', error);
      // Revert optimistic update
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      toast.error('Failed to like memory');
    } finally {
      setIsLiking(false);
    }
  };

  const isOwnMemory = user?.email && prompt.author.email && 
    user.email.toLowerCase() === prompt.author.email.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="card-playful p-6 group relative overflow-hidden min-h-[240px] flex flex-col"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-100/30 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {prompt.author.avatarUrl ? (
            <motion.img
              src={prompt.author.avatarUrl}
              alt={prompt.author.name}
              className="w-11 h-11 rounded-full border-2 border-primary-200 shadow-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          ) : (
            <motion.div 
              className="w-11 h-11 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-playful"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <User className="w-5 h-5 text-white" />
            </motion.div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{prompt.author.name}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{formatTimeAgo(prompt.createdAt)}</span>
              {prompt.community && (
                <>
                  <span>•</span>
                  <motion.span 
                    className="text-primary-600 font-medium px-2 py-1 bg-primary-50 rounded-full text-xs"
                    whileHover={{ scale: 1.05 }}
                  >
                    {prompt.community.name}
                  </motion.span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenuDropdown(!showMenuDropdown)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>

          {showMenuDropdown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20"
            >
              <button
                onClick={() => {
                  handleReport();
                  setShowMenuDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
              
              {isOwnMemory && (
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenuDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
          {showFullContent ? (
            prompt.title
          ) : (
            <Link 
              to={`/prompts/${prompt.id}`}
              className="hover:text-primary-600 transition-colors"
            >
              {prompt.title}
            </Link>
          )}
        </h3>
        
        {prompt.body && (
          <p className="text-gray-600 leading-relaxed line-clamp-3 mt-2">{prompt.body}</p>
        )}
      </div>

      {/* Poll Component */}
      {prompt.type === 'POLL' && prompt.pollOptions && (
        <div className="mb-4">
          <PollVoting 
            promptId={prompt.id}
            pollOptions={prompt.pollOptions}
            onUpdate={onUpdate}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 flex-shrink-0 mt-auto">
        <div className="flex items-center space-x-6">
          {prompt.type === 'TEXT' && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to={`/prompts/${prompt.id}`}
                className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors group"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="p-2 rounded-xl group-hover:bg-primary-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </motion.div>
                <span className="text-sm font-medium">
                  {prompt._count.responses} {prompt._count.responses === 1 ? 'response' : 'responses'}
                </span>
              </Link>
            </motion.div>
          )}
          
          {prompt.type === 'POLL' && (
            <motion.div 
              className="flex items-center space-x-2 text-gray-500"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-2 rounded-xl hover:bg-accent-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.div>
              <span className="text-sm font-medium">
                {prompt.pollOptions?.reduce((sum, option) => sum + option.voteCount, 0) || 0} votes
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowChallengeModal(true)}
            className="p-3 text-gray-400 hover:text-yellow-500 transition-colors rounded-xl hover:bg-yellow-50 group"
          >
            <motion.div
              whileHover={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShareModal(true)}
            className="p-3 text-gray-400 hover:text-primary-500 transition-colors rounded-xl hover:bg-primary-50 group"
          >
            <motion.div
              whileHover={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Share2 className="w-5 h-5" />
            </motion.div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            disabled={isLiking}
            className={`p-3 transition-colors rounded-xl group ${
              isLiked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <motion.div
              animate={isLiked ? { 
                scale: [1, 1.3, 1], 
                rotate: [0, -10, 10, 0] 
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                className={`w-5 h-5 ${
                  isLiked ? 'fill-current' : 'group-hover:fill-current'
                }`} 
              />
            </motion.div>
          </motion.button>
        </div>
      </div>
      
      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100/50 flex-shrink-0">
        <div className="flex items-center space-x-4">
          {likesCount > 0 && (
            <motion.div 
              className="flex items-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
            </motion.div>
          )}
          
          {prompt._count.responses > 0 && (
            <motion.div 
              className="flex items-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span>{prompt._count.responses} {prompt._count.responses === 1 ? 'response' : 'responses'}</span>
            </motion.div>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          {formatTimeAgo(prompt.createdAt)}
        </div>
      </div>
      </div>
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        prompt={prompt}
      />
      
      <ChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        prompt={prompt}
      />
      
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message={`Are you sure you want to delete "${prompt.title}"? This action cannot be undone.`}
      />
    </motion.div>
  );
};

export default PromptCard;