import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Minus, MessageSquare, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { promptsApi, CreateMemoryData } from '@/lib/api';
import { useGamification } from '@/hooks/useGamification';
import LoadingSpinner from './LoadingSpinner';

const createMemorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().max(2000, 'Body too long').optional(),
  type: z.enum(['TEXT', 'POLL']),
  pollOptions: z.array(z.string()).optional().default([]),
});

type CreateMemoryFormData = z.infer<typeof createMemorySchema>;

interface CreateMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { incrementPromptsCreated } = useGamification();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateMemoryFormData>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: {
      type: 'TEXT',
      pollOptions: ['', ''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error - TypeScript path constraint issue with react-hook-form
    name: 'pollOptions',
  });

  const promptType = watch('type');

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateMemoryFormData) => {
    setIsLoading(true);
    try {
      const payload: CreateMemoryData = {
        title: data.title,
        body: data.body,
        type: data.type,
        pollOptions: data.type === 'POLL' ? data.pollOptions.filter(Boolean) : undefined,
      };

      await promptsApi.createPrompt(payload);
      
      // Track gamification
      incrementPromptsCreated();
      
      toast.success('Memory created successfully!');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating memory:', error);
      toast.error('Failed to create memory');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-50"
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-[#21262d] rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#30363d]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#f0f6fc]">Create New Memory</h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 dark:text-[#7d8590] hover:text-gray-600 dark:hover:text-[#f0f6fc] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Memory Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#f0f6fc] mb-3">
                    Memory Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center space-x-3 p-3 border dark:border-[#30363d] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#30363d] transition-colors">
                      <input
                        {...register('type')}
                        type="radio"
                        value="TEXT"
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <MessageSquare className="w-5 h-5 text-gray-500 dark:text-[#7d8590]" />
                      <span className="text-sm font-medium text-gray-900 dark:text-[#f0f6fc]">Text Response</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border dark:border-[#30363d] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#30363d] transition-colors">
                      <input
                        {...register('type')}
                        type="radio"
                        value="POLL"
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <BarChart3 className="w-5 h-5 text-gray-500 dark:text-[#7d8590]" />
                      <span className="text-sm font-medium text-gray-900 dark:text-[#f0f6fc]">Poll</span>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#f0f6fc] mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    className="input"
                    placeholder="What memory would you like to share?"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#f0f6fc] mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    {...register('body')}
                    rows={3}
                    className="textarea"
                    placeholder="Add more context or details..."
                  />
                  {errors.body && (
                    <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
                  )}
                </div>

                {/* Poll Options */}
                {promptType === 'POLL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#f0f6fc] mb-2">
                      Poll Options *
                    </label>
                    <div className="space-y-3">
                      {fields.map((field: any, index: number) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <input
                            {...register(`pollOptions.${index}` as any)}
                            className="input flex-1"
                            placeholder={`Option ${index + 1}`}
                          />
                          {fields.length > 2 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-gray-400 dark:text-[#7d8590] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {fields.length < 10 && (
                      <button
                        type="button"
                        onClick={() => append('')}
                        className="mt-3 flex items-center space-x-2 text-primary-600 dark:text-[#58a6ff] hover:text-primary-700 dark:hover:text-[#79c0ff] text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add option</span>
                      </button>
                    )}

                    {errors.pollOptions && (
                      <p className="text-red-500 text-sm mt-1">
                        Please provide at least 2 valid options
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary min-w-[100px]"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'Create Memory'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateMemoryModal;