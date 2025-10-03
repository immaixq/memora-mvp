import { useState, useEffect, useCallback } from 'react';
import { BadgeData } from '@/components/Badge';

interface UserStats {
  promptsCreated: number;
  responsesPosted: number;
  upvotesReceived: number;
  communitiesJoined: number;
  streakDays: number;
  lastActiveDate: string;
}

interface Achievement {
  id: string;
  badge: BadgeData;
  condition: (stats: UserStats) => boolean;
  message: string;
}

const defaultStats: UserStats = {
  promptsCreated: 0,
  responsesPosted: 0,
  upvotesReceived: 0,
  communitiesJoined: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
};

const achievements: Achievement[] = [
  {
    id: 'first_prompt',
    badge: {
      id: 'first_prompt',
      name: 'Memory Maker',
      description: 'Created your first memory prompt',
      emoji: '✨',
      rarity: 'common',
      unlocked: false,
    },
    condition: (stats) => stats.promptsCreated >= 1,
    message: 'You\'ve shared your first memory! ✨',
  },
  {
    id: 'prolific_creator',
    badge: {
      id: 'prolific_creator',
      name: 'Prolific Creator',
      description: 'Created 10 memory prompts',
      emoji: '🚀',
      rarity: 'rare',
      unlocked: false,
    },
    condition: (stats) => stats.promptsCreated >= 10,
    message: 'You\'re on fire! 10 memories shared! 🚀',
  },
  {
    id: 'conversation_starter',
    badge: {
      id: 'conversation_starter',
      name: 'Conversation Starter',
      description: 'Posted 5 responses to prompts',
      emoji: '💬',
      rarity: 'common',
      unlocked: false,
    },
    condition: (stats) => stats.responsesPosted >= 5,
    message: 'Great conversations start with you! 💬',
  },
  {
    id: 'community_beloved',
    badge: {
      id: 'community_beloved',
      name: 'Community Beloved',
      description: 'Received 25 upvotes',
      emoji: '💖',
      rarity: 'rare',
      unlocked: false,
    },
    condition: (stats) => stats.upvotesReceived >= 25,
    message: 'The community loves your contributions! 💖',
  },
  {
    id: 'community_explorer',
    badge: {
      id: 'community_explorer',
      name: 'Community Explorer',
      description: 'Joined 3 different communities',
      emoji: '🌍',
      rarity: 'rare',
      unlocked: false,
    },
    condition: (stats) => stats.communitiesJoined >= 3,
    message: 'You\'re exploring all corners of Memora! 🌍',
  },
  {
    id: 'streak_master',
    badge: {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Maintained a 7-day activity streak',
      emoji: '🔥',
      rarity: 'epic',
      unlocked: false,
    },
    condition: (stats) => stats.streakDays >= 7,
    message: 'Your consistency is incredible! 🔥',
  },
  {
    id: 'memory_legend',
    badge: {
      id: 'memory_legend',
      name: 'Memory Legend',
      description: 'Created 50 prompts and received 100 upvotes',
      emoji: '👑',
      rarity: 'legendary',
      unlocked: false,
    },
    condition: (stats) => stats.promptsCreated >= 50 && stats.upvotesReceived >= 100,
    message: 'You are a true Memory Legend! All hail the king/queen! 👑',
  },
];

export const useGamification = () => {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('memora_user_stats');
    const savedBadges = localStorage.getItem('memora_user_badges');
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    } else {
      setBadges(achievements.map(a => ({ ...a.badge })));
    }
  }, []);

  useEffect(() => {
    // Save stats to localStorage
    localStorage.setItem('memora_user_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    // Save badges to localStorage
    localStorage.setItem('memora_user_badges', JSON.stringify(badges));
  }, [badges]);

  const checkForNewAchievements = useCallback((currentStats: UserStats) => {
    const newUnlocks: Achievement[] = [];
    
    achievements.forEach(achievement => {
      const currentBadge = badges.find(b => b.id === achievement.badge.id);
      
      if (currentBadge && !currentBadge.unlocked && achievement.condition(currentStats)) {
        newUnlocks.push(achievement);
      }
    });

    if (newUnlocks.length > 0) {
      // Use functional update to avoid dependency issues
      setBadges(current => {
        const updated = current.map(badge => {
          const unlock = newUnlocks.find(u => u.badge.id === badge.id);
          if (unlock) {
            return {
              ...badge,
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            };
          }
          return badge;
        });
        return updated;
      });
      
      setNewlyUnlocked(newUnlocks);
      
      // Clear newly unlocked after showing celebration
      setTimeout(() => {
        setNewlyUnlocked([]);
      }, 3000);
    }
  }, [badges]);

  const updateStats = useCallback((updates: Partial<UserStats>) => {
    setStats(current => {
      const newStats = { ...current, ...updates };
      checkForNewAchievements(newStats);
      return newStats;
    });
  }, [checkForNewAchievements]);

  const incrementPromptsCreated = useCallback(() => {
    updateStats({ promptsCreated: stats.promptsCreated + 1 });
  }, [updateStats, stats.promptsCreated]);

  const incrementResponsesPosted = useCallback(() => {
    updateStats({ responsesPosted: stats.responsesPosted + 1 });
  }, [updateStats, stats.responsesPosted]);

  const incrementUpvotesReceived = useCallback(() => {
    updateStats({ upvotesReceived: stats.upvotesReceived + 1 });
  }, [updateStats, stats.upvotesReceived]);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastActive = new Date(stats.lastActiveDate).toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    let newStreak = stats.streakDays;
    
    if (lastActive === today) {
      // Already active today, no change
    } else if (lastActive === yesterday) {
      // Continue streak
      newStreak += 1;
    } else {
      // Streak broken, start over
      newStreak = 1;
    }
    
    updateStats({ 
      streakDays: newStreak,
      lastActiveDate: new Date().toISOString()
    });
  }, [updateStats, stats.streakDays, stats.lastActiveDate]);

  const getUserLevel = () => {
    const totalPoints = 
      stats.promptsCreated * 10 + 
      stats.responsesPosted * 5 + 
      stats.upvotesReceived * 2 +
      stats.streakDays * 3;
    
    return Math.floor(totalPoints / 100) + 1;
  };

  const getProgressToNextLevel = () => {
    const totalPoints = 
      stats.promptsCreated * 10 + 
      stats.responsesPosted * 5 + 
      stats.upvotesReceived * 2 +
      stats.streakDays * 3;
    
    const currentLevelPoints = (getUserLevel() - 1) * 100;
    const progress = totalPoints - currentLevelPoints;
    
    return { current: progress, target: 100 };
  };

  return {
    stats,
    badges,
    newlyUnlocked,
    updateStats,
    incrementPromptsCreated,
    incrementResponsesPosted,
    incrementUpvotesReceived,
    updateStreak,
    getUserLevel,
    getProgressToNextLevel,
  };
};