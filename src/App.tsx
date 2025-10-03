import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { PromptCard } from './components/PromptCard';
import { ResponseCard } from './components/ResponseCard';
import { CreatePromptModal } from './components/CreatePromptModal';
import { ResponseModal } from './components/ResponseModal';
import { FloatingActionButton } from './components/FloatingActionButton';
import { CommunityHeader } from './components/CommunityHeader';
import { Card, CardContent } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { toast } from 'sonner@2.0.3';

// Mock data
const initialPrompts = [
  {
    id: '1',
    question: "What's your favorite late-night food stall that only locals know about?",
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1638644074459-9067407b72a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbGF1Z2hpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NTg2NTMyNjN8MA&ixlib=rb-4.0.3&q=80&w=150",
    category: 'food',
    responseCount: 12,
    likeCount: 24,
    timeAgo: '2h ago',
    isHot: true
  },
  {
    id: '2',
    question: "Which teacher had the most memorable quotes that we still remember?",
    author: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1541855099555-42c6a7c57cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2xvcmZ1bCUyMGZvb2QlMjBtYXJrZXQ&ixlib=rb-4.0.3&q=80&w=150",
    category: 'quotes',
    responseCount: 8,
    likeCount: 15,
    timeAgo: '4h ago',
    isHot: false
  },
  {
    id: '3',
    question: "What's the most hidden gem place near campus that we used to hang out at?",
    author: "Jordan Kim",
    authorAvatar: "https://images.unsplash.com/photo-1638644074459-9067407b72a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbGF1Z2hpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NTg2NTMyNjN8MA&ixlib=rb-4.0.3&q=80&w=150",
    category: 'places',
    responseCount: 6,
    likeCount: 11,
    timeAgo: '6h ago',
    isHot: false
  }
];

const mockResponses = {
  '1': [
    {
      id: 'r1',
      type: 'text' as const,
      content: "Uncle Lim's noodle cart behind the library! Open until 3am and the char kway teow is absolutely incredible. The smoky wok hei flavor is unmatched anywhere else.",
      author: "Marcus Tan",
      authorAvatar: "https://images.unsplash.com/photo-1638644074459-9067407b72a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbGF1Z2hpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NTg2NTMyNjN8MA&ixlib=rb-4.0.3&q=80&w=150",
      upvotes: 18,
      timeAgo: '1h ago',
      isTopResponse: true,
      hasUpvoted: false
    },
    {
      id: 'r2',
      type: 'poll' as const,
      pollOptions: [
        { id: 'o1', text: 'Uncle Lim\'s noodle cart', votes: 12, percentage: 60 },
        { id: 'o2', text: 'Aunty May\'s laksa stall', votes: 5, percentage: 25 },
        { id: 'o3', text: 'The 24h prata place', votes: 3, percentage: 15 }
      ],
      author: "Emma Wong",
      authorAvatar: "https://images.unsplash.com/photo-1541855099555-42c6a7c57cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2xvcmZ1bCUyMGZvb2QlMjBtYXJrZXQ&ixlib=rb-4.0.3&q=80&w=150",
      upvotes: 8,
      timeAgo: '30m ago',
      isTopResponse: false,
      hasUpvoted: true
    }
  ]
};

export default function App() {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [responses, setResponses] = useState(mockResponses);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [likedPrompts, setLikedPrompts] = useState<Set<string>>(new Set());
  const [upvotedResponses, setUpvotedResponses] = useState<Set<string>>(new Set(['r2']));

  const handleCreatePrompt = (newPrompt: { question: string; category: string }) => {
    const prompt = {
      id: Date.now().toString(),
      question: newPrompt.question,
      author: "You",
      authorAvatar: "https://images.unsplash.com/photo-1638644074459-9067407b72a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbGF1Z2hpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NTg2NTMyNjN8MA&ixlib=rb-4.0.3&q=80&w=150",
      category: newPrompt.category,
      responseCount: 0,
      likeCount: 0,
      timeAgo: 'just now',
      isHot: false
    };
    
    setPrompts([prompt, ...prompts]);
    toast("Your question has been shared with the community! 🎉");
  };

  const handleLikePrompt = (promptId: string) => {
    const newLikedPrompts = new Set(likedPrompts);
    if (likedPrompts.has(promptId)) {
      newLikedPrompts.delete(promptId);
    } else {
      newLikedPrompts.add(promptId);
    }
    setLikedPrompts(newLikedPrompts);
    
    setPrompts(prompts.map(prompt => 
      prompt.id === promptId 
        ? { ...prompt, likeCount: prompt.likeCount + (likedPrompts.has(promptId) ? -1 : 1) }
        : prompt
    ));
  };

  const handleUpvoteResponse = (responseId: string) => {
    const newUpvotedResponses = new Set(upvotedResponses);
    if (upvotedResponses.has(responseId)) {
      newUpvotedResponses.delete(responseId);
    } else {
      newUpvotedResponses.add(responseId);
    }
    setUpvotedResponses(newUpvotedResponses);
    toast(upvotedResponses.has(responseId) ? "Removed upvote" : "Upvoted! ❤️");
  };

  const handleRespondToPrompt = (promptId: string) => {
    setSelectedPrompt(promptId);
    setShowResponseModal(true);
  };

  const handleSubmitResponse = (response: { type: 'text' | 'poll'; content?: string; pollOptions?: string[] }) => {
    if (!selectedPrompt) return;
    
    const newResponse = {
      id: `r${Date.now()}`,
      type: response.type,
      ...(response.type === 'text' ? { content: response.content } : {
        pollOptions: response.pollOptions?.map((text, index) => ({
          id: `o${Date.now()}_${index}`,
          text,
          votes: 0,
          percentage: 0
        }))
      }),
      author: "You",
      authorAvatar: "https://images.unsplash.com/photo-1638644074459-9067407b72a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbGF1Z2hpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NTg2NTMyNjN8MA&ixlib=rb-4.0.3&q=80&w=150",
      upvotes: 0,
      timeAgo: 'just now',
      isTopResponse: false,
      hasUpvoted: false
    };

    setResponses(prev => ({
      ...prev,
      [selectedPrompt]: [...(prev[selectedPrompt as keyof typeof prev] || []), newResponse]
    }));

    setPrompts(prompts.map(prompt => 
      prompt.id === selectedPrompt 
        ? { ...prompt, responseCount: prompt.responseCount + 1 }
        : prompt
    ));

    toast("Your response has been added! 🎯");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <CommunityHeader 
        communityName="Class of 2019 Memories"
        memberCount={127}
        activeCount={23}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎉</span>
                  </div>
                </motion.div>
                <h2 className="text-xl mb-2">Welcome back to our memory lane!</h2>
                <p className="text-gray-600 mb-4">
                  Share your favorite memories, hidden gems, and nostalgic moments with the gang. 
                  Let's keep our connections alive!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-8">
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PromptCard
                {...prompt}
                onRespond={() => handleRespondToPrompt(prompt.id)}
                onLike={() => handleLikePrompt(prompt.id)}
                onShare={() => toast("Sharing feature coming soon! 📱")}
              />
              
              {responses[prompt.id as keyof typeof responses] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.2 }}
                  className="ml-8 mt-4 space-y-4"
                >
                  <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  {responses[prompt.id as keyof typeof responses].map((response, responseIndex) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: responseIndex * 0.1 }}
                    >
                      <ResponseCard
                        {...response}
                        hasUpvoted={upvotedResponses.has(response.id)}
                        onUpvote={() => handleUpvoteResponse(response.id)}
                        onReply={() => toast("Reply feature coming soon! 💬")}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-gray-500"
        >
          <p>🎯 That's all for now! Share a new memory to keep the conversation going.</p>
        </motion.div>
      </div>

      <FloatingActionButton onClick={() => setShowCreateModal(true)} />

      <CreatePromptModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePrompt}
      />

      <ResponseModal
        isOpen={showResponseModal}
        onClose={() => {
          setShowResponseModal(false);
          setSelectedPrompt(null);
        }}
        promptQuestion={selectedPrompt ? prompts.find(p => p.id === selectedPrompt)?.question || '' : ''}
        onSubmit={handleSubmitResponse}
      />
    </div>
  );
}