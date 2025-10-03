import { motion } from 'motion/react';
import { Heart, MessageCircle, Trophy, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface ResponseCardProps {
  id: string;
  type: 'text' | 'poll';
  content?: string;
  pollOptions?: PollOption[];
  author: string;
  authorAvatar: string;
  upvotes: number;
  timeAgo: string;
  isTopResponse?: boolean;
  hasUpvoted?: boolean;
  onUpvote: () => void;
  onReply: () => void;
}

export function ResponseCard({
  id,
  type,
  content,
  pollOptions,
  author,
  authorAvatar,
  upvotes,
  timeAgo,
  isTopResponse = false,
  hasUpvoted = false,
  onUpvote,
  onReply
}: ResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative"
    >
      <Card className={`border-l-4 ${isTopResponse ? 'border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white' : 'border-l-blue-400 bg-white'} shadow-md hover:shadow-lg transition-all duration-300`}>
        {isTopResponse && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -top-2 -right-2"
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-md">
              <Trophy className="w-3 h-3 mr-1" />
              Top Response
            </Badge>
          </motion.div>
        )}
        
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <ImageWithFallback
                src={authorAvatar}
                alt={author}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{author}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{timeAgo}</span>
                {isTopResponse && (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                    Trending
                  </Badge>
                )}
              </div>
              
              {type === 'text' && content && (
                <p className="text-gray-800 leading-relaxed">{content}</p>
              )}
              
              {type === 'poll' && pollOptions && (
                <div className="space-y-3">
                  {pollOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{option.text}</span>
                        <span className="text-xs text-gray-500">{option.votes} votes</span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={option.percentage} 
                          className="h-3 bg-gray-100"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${option.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUpvote}
                  className={`transition-colors ${
                    hasUpvoted 
                      ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <motion.div
                    animate={hasUpvoted ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${hasUpvoted ? 'fill-current' : ''}`} />
                  </motion.div>
                  {upvotes}
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReply}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </motion.div>
            </div>
            
            {isTopResponse && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center text-yellow-600"
              >
                <TrendingUp className="w-4 h-4" />
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}