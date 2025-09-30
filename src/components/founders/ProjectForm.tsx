import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUpload from '../common/ImageUpload';
import MultiSelectTagsInput from '../common/MultiSelectTagsInput';
import { Book, Briefcase, Clock, Cpu, Users, Zap } from 'lucide-react';

export interface ProjectFormData {
  title: string;
  description: string;
  skills: string[]; // Array of selected skill names
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxStudents: number;
  projectImage?: File | null;
}

interface ProjectFormProps {
  onSubmit: SubmitHandler<ProjectFormData>;
  initialData?: Partial<ProjectFormData>;
  isSubmitting?: boolean;
  isEditMode?: boolean;
  disabled?: boolean;
  availableSkills: string[]; // New prop for available skills
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialData, isSubmitting, isEditMode = false, disabled = false, availableSkills }) => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: initialData || {
      projectImage: null,
      difficulty: 'intermediate',
      maxStudents: 1,
    },
  });

  return (
    <Card className="bg-neutral-900 border border-custom-cyan shadow-lg shadow-custom-cyan/10">
      <div className="text-center mb-8">
        <Briefcase className="mx-auto h-12 w-12 text-custom-cyan" />
        <h1 className="text-4xl font-bold text-custom-cyan mt-4">
          {isEditMode ? 'Edit Project' : 'Post a New Project'}
        </h1>
        <p className="text-neutral-400 mt-2">
          {isEditMode ? 'Update the details below.' : 'Fill in the details to get your project in front of talented students.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Controller
                name="projectImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    label="Project Header Image"
                    onFileChange={(file: File | null) => field.onChange(file)}
                  />
                )}
              />
              <Input
                label="Project Title"
                placeholder="e.g., AI-Powered Code Review Assistant"
                leftIcon={<Book className="w-4 h-4" />}
                {...register('title', { required: 'Project title is required' })}
                error={errors.title?.message}
                disabled={disabled}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/50 focus:border-custom-cyan min-h-[120px] transition"
                  placeholder="Provide a detailed description of your project, its goals, and what students will learn."
                  {...register('description', { required: 'Description is required' })}
                  disabled={disabled}
                />
                {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>}
              </div>
              <Controller
                name="skills"
                control={control}
                rules={{ required: 'At least one skill is required' }}
                render={({ field }) => (
                  <MultiSelectTagsInput
                    label="Required Skills"
                    availableOptions={availableSkills}
                    selectedOptions={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select skills..."
                    disabled={disabled}
                  />
                )}
              />
              {errors.skills && <p className="mt-1.5 text-sm text-red-500">{errors.skills.message}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Estimated Duration"
                  placeholder="e.g., 6 weeks"
                  leftIcon={<Clock className="w-4 h-4" />}
                  {...register('duration', { required: 'Duration is required' })}
                  error={errors.duration?.message}
                  disabled={disabled}
                />
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-300 mb-1.5">
                    <Zap className="w-4 h-4 mr-2" />
                    Difficulty
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-cyan/50 focus:border-custom-cyan transition"
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    disabled={disabled}
                  >
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
                disabled={disabled}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isSubmitting}
                disabled={isSubmitting || disabled}
              >
                <Cpu className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : (isEditMode ? 'Save Changes' : 'Post Project')}
              </Button>
      </form>
    </Card>
  );
};

export default ProjectForm;
