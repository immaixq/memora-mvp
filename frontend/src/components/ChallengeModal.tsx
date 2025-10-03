import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Copy, MessageCircle, Mail, Send } from 'lucide-react';
import { Prompt } from '@/lib/api';
import toast from 'react-hot-toast';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ isOpen, onClose, prompt }) => {
  const [friendEmail, setFriendEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);

  const challengeUrl = `${window.location.origin}/prompts/${prompt.id}`;
  const defaultMessage = `Hey! I found this interesting memory on Memora and thought you'd have a great answer: "${prompt.title}". What do you think?`;

  const handleCopyChallenge = async () => {
    const challengeText = `${customMessage || defaultMessage}\n\nJoin the conversation: ${challengeUrl}`;
    
    try {
      await navigator.clipboard.writeText(challengeText);
      toast.success('Challenge copied! Send it to your friend 📋');
    } catch (error) {
      toast.error('Failed to copy challenge');
    }
  };

  const handleWhatsAppChallenge = () => {
    const message = encodeURIComponent(`${customMessage || defaultMessage}\n\n${challengeUrl}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailChallenge = () => {
    const subject = encodeURIComponent(`Challenge: ${prompt.title}`);
    const body = encodeURIComponent(`${customMessage || defaultMessage}\n\nClick here to respond: ${challengeUrl}`);
    const emailUrl = `mailto:${friendEmail}?subject=${subject}&body=${body}`;
    window.open(emailUrl, '_blank');
    
    if (friendEmail) {
      toast.success('Email challenge opened! 📧');
      onClose();
    } else {
      toast.error('Please enter your friend\'s email');
    }
  };

  const handleDirectChallenge = async () => {
    setSending(true);
    
    // Simulate sending challenge (in real app, this would call an API)
    setTimeout(() => {
      toast.success('Challenge sent! Your friend will be notified 🚀');
      setSending(false);
      onClose();
    }, 1500);
  };

  const challengeOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      action: handleWhatsAppChallenge,
      description: 'Send via WhatsApp',
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      action: handleEmailChallenge,
      description: 'Send via email',
    },
    {
      name: 'Copy Link',
      icon: Copy,
      color: 'from-purple-500 to-purple-600',
      action: handleCopyChallenge,
      description: 'Copy to share anywhere',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-playful-lg max-w-lg w-full overflow-hidden mx-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-playful"
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 1,
                      type: "spring"
                    }}
                  >
                    <Zap className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold gradient-text">Challenge a Friend</h3>
                    <p className="text-sm text-gray-600">See who has the best response!</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white/50"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-6">
                {/* Prompt Preview */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-5 mb-6 border-2 border-primary-100 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-300/20 to-transparent rounded-full -translate-y-10 translate-x-10" />
                  <div className="relative">
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{prompt.title}</h4>
                    {prompt.body && (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{prompt.body}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
                      <span className="bg-white/50 px-2 py-1 rounded-full">by {prompt.author.name}</span>
                      {prompt.community && (
                        <span className="bg-white/50 px-2 py-1 rounded-full">{prompt.community.name}</span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Custom Message */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenge message (optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder={defaultMessage}
                    className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Email Input for Direct Challenge */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Friend's email (for direct challenge)
                  </label>
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full input"
                  />
                </div>

                {/* Challenge Options */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                    <h5 className="text-sm font-medium text-gray-700">Send challenge via:</h5>
                  </div>
                  
                  {challengeOptions.map((option, index) => (
                    <motion.button
                      key={option.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={option.action}
                      className={`w-full p-4 rounded-xl bg-gradient-to-r ${option.color} hover:shadow-xl text-white transition-all duration-300 shadow-playful-lg transform hover:scale-105`}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs opacity-90">{option.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Direct Challenge Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDirectChallenge}
                  disabled={!friendEmail || sending}
                  className={`w-full p-4 rounded-xl font-medium transition-all duration-200 ${
                    friendEmail && !sending
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-playful hover:shadow-playful-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {sending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>{sending ? 'Sending Challenge...' : 'Send Direct Challenge'}</span>
                  </div>
                </motion.button>

                {/* Fun encouragement */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                >
                  <motion.div 
                    className="text-3xl mb-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 3 
                    }}
                  >
                    ⚡
                  </motion.div>
                  <p className="text-sm text-gray-700 font-medium">
                    Challenge your friends and see who has the best memories!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    The most engaging responses get highlighted
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChallengeModal;