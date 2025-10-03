import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { responsesApi } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const createResponseSchema = z.object({
  text: z.string().min(1, 'Response cannot be empty').max(1000, 'Response too long'),
});

type CreateResponseFormData = z.infer<typeof createResponseSchema>;

interface CreateResponseFormProps {
  promptId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  compact?: boolean;
}

const CreateResponseForm: React.FC<CreateResponseFormProps> = ({
  promptId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = "Share your thoughts, experiences, or recommendations...",
  compact = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateResponseFormData>({
    resolver: zodResolver(createResponseSchema),
  });

  const text = watch('text') || '';
  const remainingChars = 1000 - text.length;

  const onSubmit = async (data: CreateResponseFormData) => {
    setIsSubmitting(true);
    try {
      await responsesApi.createResponse({
        promptId,
        parentId,
        text: data.text,
      });
      
      reset();
      toast.success(parentId ? 'Reply added!' : 'Response added!');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating response:', error);
      toast.error('Failed to add response');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={compact ? "" : "card p-6"}
    >
      {!compact && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add your response
        </h3>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <textarea
            {...register('text')}
            rows={compact ? 2 : 4}
            className={compact ? "w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm" : "textarea"}
            placeholder={placeholder}
          />
          <div className="flex items-center justify-between mt-2">
            <div>
              {errors.text && (
                <p className="text-red-500 text-sm">{errors.text.message}</p>
              )}
            </div>
            <span
              className={`text-sm ${
                remainingChars < 50 ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {remainingChars} characters remaining
            </span>
          </div>
        </div>

        <div className={`flex ${compact ? 'justify-between' : 'justify-end'} space-x-2`}>
          {compact && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || text.trim().length === 0}
            className={compact ? "px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1" : "btn btn-primary flex items-center space-x-2"}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send className={compact ? "w-3 h-3" : "w-4 h-4"} />
            )}
            <span>{isSubmitting ? 'Posting...' : (parentId ? 'Reply' : 'Post Response')}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateResponseForm;