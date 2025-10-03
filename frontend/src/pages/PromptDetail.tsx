import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { promptsApi, Prompt } from '@/lib/api';
import PromptCard from '@/components/PromptCard';
import ThreadedResponse from '@/components/ThreadedResponse';
import CreateResponseForm from '@/components/CreateResponseForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompt = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data } = await promptsApi.getPrompt(id);
      setPrompt(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching prompt:', error);
      if (error.response?.status === 404) {
        setError('Prompt not found');
      } else {
        setError('Failed to load prompt');
        toast.error('Failed to load prompt');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const handleUpdate = () => {
    fetchPrompt();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error === 'Prompt not found') {
    return <Navigate to="/" replace />;
  }

  if (error || !prompt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Failed to load prompt</p>
        <button
          onClick={fetchPrompt}
          className="btn btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to feed</span>
        </button>
      </motion.div>

      {/* Prompt Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PromptCard 
          prompt={prompt} 
          onUpdate={handleUpdate}
          showFullContent={true}
        />
      </motion.div>

      {/* Response Section for Text Prompts */}
      {prompt.type === 'TEXT' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <CreateResponseForm 
            promptId={prompt.id}
            onSuccess={handleUpdate}
          />
          
          {/* Threaded Responses */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {prompt.responses?.length || 0} {(prompt.responses?.length || 0) === 1 ? 'Response' : 'Responses'}
            </h3>
            
            {prompt.responses?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No responses yet.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prompt.responses?.map((response) => (
                  <ThreadedResponse
                    key={response.id}
                    response={response}
                    promptId={prompt.id}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PromptDetail;