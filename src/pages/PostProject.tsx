import React from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

interface PostProjectFormData {
  title: string;
  description: string;
  skills: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxStudents: number;
}

const PostProject: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PostProjectFormData>();

  const onSubmit = async (data: PostProjectFormData) => {
    // For now, just log the data
    console.log('Project Data:', data);
    reset();
    alert('Project submitted! (Check console for data)');
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-xl mx-auto">
          <Card className="bg-neutral-900 border border-custom-cyan text-white">
            <h1 className="text-3xl font-bold text-custom-cyan mb-6">Post a New Project</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Project Title"
                placeholder="Enter project title"
                {...register('title', { required: 'Project title is required' })}
                error={errors.title?.message}
              />
              <div>
                <label className="block text-sm font-medium text-white mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/20 focus:border-custom-cyan min-h-[100px]"
                  placeholder="Describe your project..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>}
              </div>
              <Input
                label="Required Skills"
                placeholder="e.g. React, TypeScript, UI/UX"
                {...register('skills', { required: 'At least one skill is required' })}
                error={errors.skills?.message}
              />
              <Input
                label="Duration"
                placeholder="e.g. 6 weeks"
                {...register('duration', { required: 'Duration is required' })}
                error={errors.duration?.message}
              />
              <div>
                <label className="block text-sm font-medium text-white mb-1">Difficulty</label>
                <select
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/20 focus:border-custom-cyan"
                  {...register('difficulty', { required: 'Difficulty is required' })}
                  defaultValue=""
                >
                  <option value="" disabled>Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {errors.difficulty && <p className="mt-1.5 text-sm text-red-500">{errors.difficulty.message}</p>}
              </div>
              <Input
                label="Max Students"
                type="number"
                min={1}
                {...register('maxStudents', { required: 'Max students is required', min: { value: 1, message: 'At least 1 student' } })}
                error={errors.maxStudents?.message}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
              >
                Post Project
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PostProject;
