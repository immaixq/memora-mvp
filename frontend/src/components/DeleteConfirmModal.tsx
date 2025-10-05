import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Memory',
  message = 'Are you sure you want to delete this memory? This action cannot be undone.',
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-50 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#21262d] rounded-2xl shadow-playful-lg max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#30363d] bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-playful"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-400">{title}</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 dark:text-[#7d8590] hover:text-gray-600 dark:hover:text-[#f0f6fc] transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-[#30363d]/50"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-[#7d8590] mb-6 leading-relaxed">
                  {message}
                </p>

                {/* Warning box */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 dark:text-red-400 font-medium text-sm">This action is permanent</p>
                      <p className="text-red-600 dark:text-red-500 text-sm">The memory and all associated data will be lost forever.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isLoading
                        ? 'bg-gray-300 dark:bg-[#30363d] text-gray-500 dark:text-[#7d8590] cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-playful hover:shadow-playful-lg hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>{isLoading ? 'Deleting...' : 'Delete Forever'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;