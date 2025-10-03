import { motion } from 'motion/react';
import { Users, Flame, Trophy, Sparkles, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CommunityHeaderProps {
  communityName: string;
  memberCount: number;
  activeCount: number;
}

export function CommunityHeader({ communityName, memberCount, activeCount }: CommunityHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-200 backdrop-blur-sm"
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"
              />
            </motion.div>
            
            <div>
              <h1 className="text-xl">{communityName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{memberCount} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{activeCount} online</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Hot Topics</span>
                <Badge className="bg-orange-100 text-orange-700 text-xs">3</Badge>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-yellow-50 hover:border-yellow-300">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span>Leaderboard</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button variant="ghost" size="sm" className="relative hover:bg-blue-50">
                <Bell className="w-5 h-5 text-gray-600" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs text-white">2</span>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
        />
      </div>
    </motion.div>
  );
}