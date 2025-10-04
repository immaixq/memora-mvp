import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Users, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { communitiesApi } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';

const createCommunitySchema = z.object({
  name: z.string().min(1, 'Community name is required').max(100, 'Name too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

type CreateCommunityFormData = z.infer<typeof createCommunitySchema>;

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (community: any) => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCommunityFormData>({
    resolver: zodResolver(createCommunitySchema),
  });

  const name = watch('name');

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    setValue('slug', slug);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateCommunityFormData) => {
    setIsLoading(true);
    try {
      const response = await communitiesApi.createCommunity(data);
      toast.success(`Community "${data.name}" created successfully! 🎉`);
      handleClose();
      onSuccess?.(response.data);
    } catch (error: any) {
      console.error('Error creating community:', error);
      if (error.response?.status === 409) {
        toast.error('A community with this slug already exists');
      } else {
        toast.error('Failed to create community');
      }
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
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-playful-lg max-w-lg w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-playful">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold gradient-text">Create Community</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white/50"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Community Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Name *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('name', {
                        onChange: (e) => handleNameChange(e.target.value),
                      })}
                      className="input pl-10"
                      placeholder="e.g., CHIJ Class of 2015, NUS Computer Science"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Community Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community URL *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('slug')}
                      className="input pl-10"
                      placeholder="chij-class-2015"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    This will be your community's unique URL: memora.com/c/{watch('slug') || 'your-slug'}
                  </p>
                </div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border-2 border-primary-100"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">✨</div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Create Your Memory Hub</h4>
                      <p className="text-sm text-gray-600">
                        Communities are perfect for alumni groups, friend circles, or any group wanting to 
                        share memories, favorite places, and nostalgic moments together.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !name?.trim()}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    className="btn btn-primary min-w-[140px] flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Create Community</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCommunityModal;