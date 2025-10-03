import { motion } from 'motion/react';
import { MessageCircle, Heart, Share2, Users, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PromptCardProps {
  id: string;
  question: string;
  author: string;
  authorAvatar: string;
  category: string;
  responseCount: number;
  likeCount: number;
  timeAgo: string;
  isHot?: boolean;
  onRespond: () => void;
  onLike: () => void;
  onShare: () => void;
}

export function PromptCard({
  id,
  question,
  author,
  authorAvatar,
  category,
  responseCount,
  likeCount,
  timeAgo,
  isHot = false,
  onRespond,
  onLike,
  onShare
}: PromptCardProps) {
  const getCategoryColor = (cat: string) => {
    const colors = {
      food: 'bg-orange-100 text-orange-700 border-orange-200',
      places: 'bg-blue-100 text-blue-700 border-blue-200',
      quotes: 'bg-purple-100 text-purple-700 border-purple-200',
      memories: 'bg-pink-100 text-pink-700 border-pink-200',
      general: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[cat as keyof typeof colors] || colors.general;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative"
    >
      <Card className="overflow-hidden border-2 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
        {isHot && (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 z-10"
          >
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Hot!
            </Badge>
          </motion.div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <ImageWithFallback
                src={authorAvatar}
                alt={author}
                className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{author}</span>
                <Badge variant="outline" className={`text-xs ${getCategoryColor(category)}`}>
                  {category}
                </Badge>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{timeAgo}</span>
              </div>
              
              <motion.h3
                className="text-lg text-gray-900 leading-relaxed cursor-pointer"
                whileHover={{ scale: 1.01 }}
                onClick={onRespond}
              >
                {question}
              </motion.h3>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRespond}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {responseCount} responses
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {likeCount}
                </Button>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}