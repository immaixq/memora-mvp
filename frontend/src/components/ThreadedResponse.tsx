import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageCircle, ArrowUp, User } from 'lucide-react';
import { Response } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import CreateResponseForm from './CreateResponseForm';

interface ThreadedResponseProps {
  response: Response;
  promptId: string;
  depth?: number;
  onUpdate?: () => void;
}

const ThreadedResponse: React.FC<ThreadedResponseProps> = ({ 
  response, 
  promptId, 
  depth = 0, 
  onUpdate 
}) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isUpvoted] = useState(false);
  const [upvotesCount] = useState(response.upvotesCount);

  const hasReplies = response.replies && response.replies.length > 0;
  const totalReplies = response.replies?.length || 0;
  
  // Limit visual nesting depth for better UX
  const visualDepth = Math.min(depth, 6);
  const indentWidth = visualDepth * 24; // 24px per level

  const onUpvote = () => {
    // Upvote functionality to be implemented when API is ready
  };

  const handleUpvote = async () => {
    onUpvote();
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onUpdate?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative"
      style={{ marginLeft: `${indentWidth}px` }}
    >
      {/* Connection Line for nested replies */}
      {depth > 0 && (
        <div className="absolute left-[-12px] top-0 bottom-0 w-0.5 bg-gray-200" />
      )}
      
      <div className={`bg-white rounded-xl border border-gray-200 p-4 ${
        depth > 0 ? 'shadow-sm' : 'shadow-md'
      } hover:shadow-lg transition-shadow duration-200`}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {response.author.avatarUrl ? (
              <img
                src={response.author.avatarUrl}
                alt={response.author.name}
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900 text-sm">{response.author.name}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(response.createdAt)}</p>
            </div>
          </div>
          
          {hasReplies && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>{totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}</span>
              {isCollapsed ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-gray-800 leading-relaxed">{response.text}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpvote}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              isUpvoted 
                ? 'text-orange-600 bg-orange-50' 
                : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <ArrowUp className="w-3 h-3" />
            <span>{upvotesCount}</span>
          </motion.button>
          
          {user && depth < 10 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Reply</span>
            </motion.button>
          )}
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-gray-100"
            >
              <CreateResponseForm
                promptId={promptId}
                parentId={response.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${response.author.name}...`}
                compact
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {hasReplies && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-3"
          >
            {response.replies!.map((reply) => (
              <ThreadedResponse
                key={reply.id}
                response={reply}
                promptId={promptId}
                depth={depth + 1}
                onUpdate={onUpdate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ThreadedResponse;