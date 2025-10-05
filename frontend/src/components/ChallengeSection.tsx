import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Share2, 
  MessageCircle, 
  Mail, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  Users,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Prompt } from '@/lib/api';
import toast from 'react-hot-toast';

interface ChallengeSectionProps {
  prompt: Prompt;
  className?: string;
}

const ChallengeSection: React.FC<ChallengeSectionProps> = ({ prompt, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  const challengeUrl = `${window.location.origin}/prompts/${prompt.id}`;
  const defaultMessage = `Hey! I found this interesting memory on Memora and thought you'd have a great answer: "${prompt.title}". What do you think?`;

  const handleQuickShare = async () => {
    const challengeText = `${defaultMessage}\n\nJoin the conversation: ${challengeUrl}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Challenge: ${prompt.title}`,
          text: defaultMessage,
          url: challengeUrl,
        });
        toast.success('Challenge shared! 🚀');
      } else {
        await navigator.clipboard.writeText(challengeText);
        toast.success('Challenge copied! Share it with friends 📋');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopyChallenge = async () => {
    const challengeText = `${customMessage || defaultMessage}\n\nJoin the conversation: ${challengeUrl}`;
    
    try {
      await navigator.clipboard.writeText(challengeText);
      toast.success('Challenge copied! 📋');
    } catch (error) {
      toast.error('Failed to copy challenge');
    }
  };

  const handleWhatsAppChallenge = () => {
    const message = encodeURIComponent(`${customMessage || defaultMessage}\n\n${challengeUrl}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp... 💬');
  };

  const handleEmailChallenge = () => {
    const subject = encodeURIComponent(`Challenge: ${prompt.title}`);
    const body = encodeURIComponent(`${customMessage || defaultMessage}\n\nClick here to respond: ${challengeUrl}`);
    const emailUrl = `mailto:${friendEmail}?subject=${subject}&body=${body}`;
    window.open(emailUrl, '_blank');
    
    if (friendEmail) {
      toast.success('Email challenge opened! 📧');
    } else {
      toast.error('Please enter your friend\'s email');
    }
  };

  const quickActions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: handleWhatsAppChallenge,
    },
    {
      name: 'Copy Link',
      icon: Copy,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: handleCopyChallenge,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: handleEmailChallenge,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-[#21262d] dark:via-[#21262d] dark:to-[#21262d] rounded-2xl border border-orange-100 dark:border-[#30363d] overflow-hidden ${className}`}
    >
      {/* Main Challenge CTA */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#f0f6fc] flex items-center gap-2">
                Challenge Friends
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </motion.div>
              </h3>
              <p className="text-sm text-gray-600 dark:text-[#7d8590]">See who has the best response to this memory</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickShare}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            aria-label="Quick share challenge"
          >
            <Share2 className="w-4 h-4" />
            <span>Quick Share</span>
          </motion.button>
        </div>

        {/* Stats & Motivation */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-[#7d8590] mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{prompt._count?.responses || 0} responses</span>
            </div>
            <div className="flex items-center space-x-1">
              <ExternalLink className="w-4 h-4" />
              <span>Share & compare answers</span>
            </div>
          </div>
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-orange-600 dark:text-[#58a6ff] hover:text-orange-700 dark:hover:text-[#79c0ff] font-medium"
            whileHover={{ scale: 1.05 }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Hide sharing options' : 'Show more sharing options'}
          >
            <span>More options</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`${action.color} text-white p-3 rounded-xl flex flex-col items-center space-y-1 transition-all duration-200 shadow-md hover:shadow-lg`}
              aria-label={`Share via ${action.name}`}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Expanded Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-orange-200 dark:border-[#30363d] bg-white/50 dark:bg-[#161b22]/50"
          >
            <div className="p-6 space-y-4">
              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#f0f6fc] mb-2">
                  Customize your challenge message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={defaultMessage}
                  className="w-full p-3 border border-gray-300 dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#f0f6fc] rounded-xl resize-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#58a6ff] focus:border-transparent text-sm"
                  rows={3}
                  aria-label="Custom challenge message"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#f0f6fc] mb-2">
                  Friend's email (for direct email challenge)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="flex-1 p-3 border border-gray-300 dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#f0f6fc] rounded-xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#58a6ff] focus:border-transparent text-sm"
                    aria-label="Friend's email address"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEmailChallenge}
                    disabled={!friendEmail}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      friendEmail 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg' 
                        : 'bg-gray-200 dark:bg-[#30363d] text-gray-400 dark:text-[#7d8590] cursor-not-allowed'
                    }`}
                    aria-label="Send email challenge"
                  >
                    <Mail className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Challenge URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#f0f6fc] mb-2">
                  Direct link to this memory
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={challengeUrl}
                    readOnly
                    className="flex-1 p-3 bg-gray-50 dark:bg-[#161b22] border border-gray-300 dark:border-[#30363d] rounded-xl text-sm text-gray-600 dark:text-[#7d8590]"
                    aria-label="Challenge URL"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyChallenge}
                    className="px-4 py-3 bg-gray-600 dark:bg-[#30363d] text-white rounded-xl hover:bg-gray-700 dark:hover:bg-[#3c434d] transition-colors"
                    aria-label="Copy challenge URL"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChallengeSection;