import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Users, MessageSquare, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: { question: string; category: string }) => void;
}

export function CreatePromptModal({ isOpen, onClose, onSubmit }: CreatePromptModalProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    { value: 'food', label: 'Food & Eats', icon: '🍕', color: 'orange' },
    { value: 'places', label: 'Cool Places', icon: '📍', color: 'blue' },
    { value: 'quotes', label: 'Memorable Quotes', icon: '💭', color: 'purple' },
    { value: 'memories', label: 'Nostalgic Moments', icon: '📸', color: 'pink' },
    { value: 'general', label: 'General Chat', icon: '💬', color: 'green' }
  ];

  const prompts = [
    "What's your favorite late-night food stall near campus?",
    "Which teacher had the most memorable quotes?",
    "What's a hidden gem place only we know about?",
    "What's your most nostalgic memory from high school?",
    "Where did we always hang out after school?"
  ];

  const handleSubmit = () => {
    if (question.trim() && category) {
      onSubmit({ question: question.trim(), category });
      setQuestion('');
      setCategory('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className="border-2 shadow-2xl bg-gradient-to-br from-white via-white to-gray-50">
              <CardHeader className="relative pb-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg"></div>
                </motion.div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">Start a New Conversation</CardTitle>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <label className="block mb-3">What's on your mind?</label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask something that will spark great conversations..."
                    className="min-h-[100px] resize-none border-2 focus:border-blue-400 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block mb-3">Need inspiration? Try these:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {prompts.map((prompt, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setQuestion(prompt)}
                          className="w-full text-left justify-start h-auto py-3 px-4 border-dashed hover:border-solid hover:bg-blue-50 hover:border-blue-300 transition-all"
                        >
                          <MessageSquare className="w-4 h-4 mr-3 text-blue-500" />
                          <span className="text-sm text-gray-700">{prompt}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-3">Pick a category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <motion.div
                        key={cat.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={category === cat.value ? "default" : "outline"}
                          onClick={() => setCategory(cat.value)}
                          className={`w-full h-auto py-3 flex flex-col items-center gap-2 ${
                            category === cat.value 
                              ? `bg-${cat.color}-500 hover:bg-${cat.color}-600 text-white border-${cat.color}-500` 
                              : `hover:bg-${cat.color}-50 hover:border-${cat.color}-300`
                          } transition-all`}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-xs">{cat.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={!question.trim() || !category}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Share with Community
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}