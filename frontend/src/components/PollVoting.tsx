import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, TrendingUp, Users } from 'lucide-react';
import { promptsApi, PollOption } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface PollVotingProps {
  promptId: string;
  pollOptions: PollOption[];
  userVote?: string; // ID of option user voted for
  onUpdate?: () => void;
}

const PollVoting: React.FC<PollVotingProps> = ({ 
  promptId, 
  pollOptions: initialOptions,
  userVote,
  onUpdate 
}) => {
  const { user } = useAuth();
  const [pollOptions, setPollOptions] = useState(initialOptions);
  const [selectedOption, setSelectedOption] = useState<string | null>(userVote || null);
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(!!userVote);

  useEffect(() => {
    setPollOptions(initialOptions);
    setSelectedOption(userVote || null);
    setShowResults(!!userVote);
  }, [initialOptions, userVote]);

  const totalVotes = pollOptions.reduce((sum, option) => sum + option.voteCount, 0);

  const handleVote = async (pollOptionId: string) => {
    if (isVoting || !user) {
      if (!user) {
        toast.error('Please sign in to vote');
      }
      return;
    }

    setIsVoting(true);
    // Optimistic update
    const previousOptions = [...pollOptions];
    const previousSelection = selectedOption;
    
    setSelectedOption(pollOptionId);
    setShowResults(true);
    
    // Update vote counts optimistically
    const updatedOptions = pollOptions.map(option => {
      if (option.id === pollOptionId) {
        return { ...option, voteCount: option.voteCount + (selectedOption === option.id ? 0 : 1) };
      }
      if (selectedOption === option.id) {
        return { ...option, voteCount: Math.max(0, option.voteCount - 1) };
      }
      return option;
    });
    setPollOptions(updatedOptions);

    try {
      const { data } = await promptsApi.voteOnPoll(promptId, pollOptionId);
      setPollOptions(data.pollOptions);
      toast.success(selectedOption ? 'Vote updated!' : 'Vote recorded!');
      onUpdate?.();
    } catch (error: any) {
      // Revert optimistic update on error
      setPollOptions(previousOptions);
      setSelectedOption(previousSelection);
      setShowResults(!!previousSelection);
      console.error('Error voting on poll:', error);
      toast.error('Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  const getWinningOption = () => {
    return pollOptions.reduce((max, option) => 
      option.voteCount > max.voteCount ? option : max
    );
  };

  const winningOption = getWinningOption();

  return (
    <div className="space-y-4">
      {/* Poll Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </span>
        </div>
        {totalVotes > 0 && (
          <button
            onClick={() => setShowResults(!showResults)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
        )}
      </div>

      <div className="space-y-3">
      {pollOptions.map((option, index) => {
        const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
        const isSelected = selectedOption === option.id;

        const isWinning = winningOption.id === option.id && totalVotes > 0 && showResults;
        
        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleVote(option.id)}
              disabled={isVoting}
              className={cn(
                'relative w-full p-4 rounded-xl border-2 text-left transition-all duration-300 overflow-hidden group',
                isSelected
                  ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 bg-white hover:bg-gray-50',
                isWinning && 'ring-2 ring-yellow-400 ring-opacity-50',
                isVoting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Background bar showing percentage */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                    className={cn(
                      'absolute inset-y-0 left-0 opacity-20 rounded-xl',
                      isSelected ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-300'
                    )}
                  />
                )}
              </AnimatePresence>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                      isSelected
                        ? 'border-primary-500 bg-primary-500 shadow-md'
                        : 'border-gray-300 group-hover:border-primary-400 group-hover:shadow-sm'
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{option.text}</span>
                    {isWinning && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: 0.5 }}
                      >
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {showResults && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-right"
                  >
                    <span className="text-sm font-bold text-gray-800">
                      {Math.round(percentage)}%
                    </span>
                    <div className="text-xs text-gray-500">
                      {option.voteCount} {option.voteCount === 1 ? 'vote' : 'votes'}
                    </div>
                  </motion.div>
                )}
              </div>
            </button>
          </motion.div>
        );
      })}

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p className="text-sm text-gray-600">
            Sign in to vote and see results
          </p>
        </motion.div>
      )}
    </div>
  </div>
  );
};

export default PollVoting;