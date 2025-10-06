import { motion } from 'framer-motion';
import { Heart, User, Flag } from 'lucide-react';
import { useState } from 'react';
import { Response, responsesApi } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ResponseListProps {
  responses: Response[];
  onUpdate?: () => void;
}

const ResponseList: React.FC<ResponseListProps> = ({ responses, onUpdate }) => {
  const [loadingUpvotes, setLoadingUpvotes] = useState<Record<string, boolean>>({});

  const handleUpvote = async (responseId: string) => {
    if (loadingUpvotes[responseId]) return;

    setLoadingUpvotes(prev => ({ ...prev, [responseId]: true }));
    
    try {
      await responsesApi.upvoteResponse(responseId);
      onUpdate?.();
    } catch (error: any) {
      console.error('Error upvoting response:', error);
      toast.error('Failed to upvote response');
    } finally {
      setLoadingUpvotes(prev => ({ ...prev, [responseId]: false }));
    }
  };

  const handleReport = () => {
    // Report functionality to be implemented when API is ready
    toast.success('Report submitted (feature coming soon)');
  };

  if (responses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500 text-lg">No responses yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Be the first to share your thoughts!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Responses ({responses.length})
      </h3>
      
      <div className="space-y-4">
        {responses.map((response, index) => (
          <motion.div
            key={response.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-6"
          >
            {/* Response Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {response.author.avatarUrl ? (
                  <img
                    src={response.author.avatarUrl}
                    alt={response.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{response.author.name}</p>
                  <p className="text-sm text-gray-500">{formatTimeAgo(response.createdAt)}</p>
                </div>
              </div>

              <button
                onClick={() => handleReport()}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>

            {/* Response Content */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {response.text}
              </p>
            </div>

            {/* Response Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => handleUpvote(response.id)}
                disabled={loadingUpvotes[response.id]}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">
                  {response.upvotesCount} {response.upvotesCount === 1 ? 'upvote' : 'upvotes'}
                </span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResponseList;