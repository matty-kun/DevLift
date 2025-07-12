import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ImageUpload from '../components/common/ImageUpload';
import { Book, Briefcase, Clock, Code, Cpu, Users, Zap } from 'lucide-react';

interface PostProjectFormData {
  title: string;
  description: string;
  skills: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxStudents: number;
  projectImage?: File | null;
}

const PostProject: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm<PostProjectFormData>();

  const onSubmit = async (data: PostProjectFormData) => {
    // For now, just log the data
    console.log('Project Data:', data);
    reset();
    alert('Project submitted! (Check console for data)');
  };

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-neutral-900 border border-custom-cyan shadow-lg shadow-custom-cyan/10">
            <div className="text-center mb-8">
              <Briefcase className="mx-auto h-12 w-12 text-custom-cyan" />
              <h1 className="text-4xl font-bold text-custom-cyan mt-4">Post a New Project</h1>
              <p className="text-neutral-400 mt-2">Fill in the details below to get your project in front of talented students.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="projectImage"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    label="Project Image (optional)"
                    onFileChange={onChange}
                  />
                )}
              />
              <Input
                label="Project Title"
                placeholder="e.g., AI-Powered Code Review Assistant"
                leftIcon={<Book className="w-4 h-4" />}
                {...register('title', { required: 'Project title is required' })}
                error={errors.title?.message}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/50 focus:border-custom-cyan min-h-[120px] transition"
                  placeholder="Provide a detailed description of your project, its goals, and what students will learn."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>}
              </div>
              <Input
                label="Required Skills"
                placeholder="e.g., React, TypeScript, UI/UX, Supabase"
                leftIcon={<Code className="w-4 h-4" />}
                {...register('skills', { required: 'At least one skill is required' })}
                error={errors.skills?.message}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Estimated Duration"
                  placeholder="e.g., 6 weeks"
                  leftIcon={<Clock className="w-4 h-4" />}
                  {...register('duration', { required: 'Duration is required' })}
                  error={errors.duration?.message}
                />
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-300 mb-1.5">
                    <Zap className="w-4 h-4 mr-2" />
                    Difficulty
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/50 focus:border-custom-cyan transition"
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    defaultValue=""
                  >
                    <option value="" disabled>Select difficulty level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.difficulty && <p className="mt-1.5 text-sm text-red-500">{errors.difficulty.message}</p>}
                </div>
              </div>
              <Input
                label="Max Students"
                type="number"
                min={1}
                placeholder="Enter the maximum number of students"
                leftIcon={<Users className="w-4 h-4" />}
                {...register('maxStudents', { 
                  required: 'Max students is required', 
                  min: { value: 1, message: 'At least 1 student' },
                  valueAsNumber: true,
                })}
                error={errors.maxStudents?.message}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isSubmitting}
              >
                <Cpu className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Post Project'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PostProject;
