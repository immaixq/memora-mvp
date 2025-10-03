import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, MessageCircle, Instagram, Facebook, Twitter, Send, Link as LinkIcon } from 'lucide-react';
import { Prompt } from '@/lib/api';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, prompt }) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/prompts/${prompt.id}`;
  const shareText = `Check out this memory on Memora: "${prompt.title}"`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the text
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    toast.success('Content copied! Paste it in your Instagram story 📸');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      action: handleWhatsAppShare,
      description: 'Share with friends',
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      action: handleTelegramShare,
      description: 'Send via Telegram',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:from-pink-600 hover:to-purple-700',
      action: handleInstagramShare,
      description: 'Add to story',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'from-sky-400 to-sky-500',
      hoverColor: 'hover:from-sky-500 hover:to-sky-600',
      action: handleTwitterShare,
      description: 'Tweet about it',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-indigo-600 to-indigo-700',
      hoverColor: 'hover:from-indigo-700 hover:to-indigo-800',
      action: handleFacebookShare,
      description: 'Share on timeline',
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
              className="relative bg-white rounded-2xl shadow-playful-lg max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-playful">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold gradient-text">Share Memory</h3>
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
                {/* Preview */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 mb-6 border-2 border-primary-100">
                  <h4 className="font-semibold text-gray-900 mb-1">{prompt.title}</h4>
                  {prompt.body && (
                    <p className="text-sm text-gray-600 line-clamp-2">{prompt.body}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                    <span>by {prompt.author.name}</span>
                    {prompt.community && (
                      <>
                        <span>•</span>
                        <span>{prompt.community.name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Copy Link */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className={`w-full p-4 rounded-xl border-2 border-dashed transition-all duration-200 mb-4 ${
                    copied 
                      ? 'border-success-300 bg-success-50 text-success-700'
                      : 'border-gray-300 bg-gray-50 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <motion.div
                      animate={copied ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Copy className="w-5 h-5" />
                    </motion.div>
                    <span className="font-medium">
                      {copied ? 'Copied!' : 'Copy Link'}
                    </span>
                  </div>
                </motion.button>

                {/* Share Options */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Share to social media</h5>
                  
                  {shareOptions.map((option, index) => (
                    <motion.button
                      key={option.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={option.action}
                      className={`w-full p-3 rounded-xl bg-gradient-to-r ${option.color} ${option.hoverColor} text-white transition-all duration-200 shadow-playful hover:shadow-playful-lg`}
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

                {/* Fun message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  <div className="text-2xl mb-2">✨</div>
                  <p className="text-sm text-gray-600">
                    Help your friends discover their favorite memories too!
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

export default ShareModal;