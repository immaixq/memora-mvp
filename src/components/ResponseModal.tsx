import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, BarChart3, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptQuestion: string;
  onSubmit: (response: { type: 'text' | 'poll'; content?: string; pollOptions?: string[] }) => void;
}

export function ResponseModal({ isOpen, onClose, promptQuestion, onSubmit }: ResponseModalProps) {
  const [responseType, setResponseType] = useState<'text' | 'poll'>('text');
  const [textContent, setTextContent] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleSubmit = () => {
    if (responseType === 'text' && textContent.trim()) {
      onSubmit({ type: 'text', content: textContent.trim() });
      setTextContent('');
      onClose();
    } else if (responseType === 'poll' && pollOptions.filter(opt => opt.trim()).length >= 2) {
      onSubmit({ type: 'poll', pollOptions: pollOptions.filter(opt => opt.trim()) });
      setPollOptions(['', '']);
      onClose();
    }
  };

  const isValid = responseType === 'text' 
    ? textContent.trim().length > 0 
    : pollOptions.filter(opt => opt.trim()).length >= 2;

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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="border-2 shadow-2xl bg-gradient-to-br from-white via-white to-blue-50">
              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">Respond to:</CardTitle>
                    <div className="bg-gray-100 p-3 rounded-lg border-l-4 border-blue-400">
                      <p className="text-gray-800 italic">"{promptQuestion}"</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="hover:bg-gray-100 rounded-full w-8 h-8 p-0 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Tabs value={responseType} onValueChange={(value) => setResponseType(value as 'text' | 'poll')}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Text Response
                    </TabsTrigger>
                    <TabsTrigger value="poll" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Create Poll
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <label className="block mb-3">Share your thoughts</label>
                      <Textarea
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder="What's your take on this? Share your experience, opinion, or story..."
                        className="min-h-[120px] resize-none border-2 focus:border-blue-400 transition-colors"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-500">
                          Make it personal and engaging!
                        </div>
                        <div className="text-xs text-gray-400">
                          {textContent.length}/500
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="poll" className="space-y-4">
                    <div>
                      <label className="block mb-3">Poll Options</label>
                      <div className="space-y-3">
                        {pollOptions.map((option, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm text-blue-600">{index + 1}</span>
                            </div>
                            <Input
                              value={option}
                              onChange={(e) => updatePollOption(index, e.target.value)}
                              placeholder={`Option ${index + 1}...`}
                              className="flex-1 border-2 focus:border-blue-400"
                            />
                            {pollOptions.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePollOption(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      
                      {pollOptions.length < 5 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            onClick={addPollOption}
                            className="w-full border-dashed hover:border-solid hover:bg-blue-50 hover:border-blue-300 transition-all"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </motion.div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Add 2-5 options for people to vote on
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-3 pt-4 border-t">
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
                      disabled={!isValid}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {responseType === 'text' ? (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Post Response
                        </>
                      ) : (
                        <>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Create Poll
                        </>
                      )}
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