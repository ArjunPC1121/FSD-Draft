import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface TeamFormProps {
  leagueId: string;
  onSuccess: () => void;
}

interface TeamFormData {
  name: string;
  logo_url: string;
}

export default function TeamForm({ leagueId, onSuccess }: TeamFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    defaultValues: {
      logo_url: '',
    },
  });
  
  const onSubmit = async (data: TeamFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('teams')
        .insert({
          league_id: leagueId,
          name: data.name,
          logo_url: data.logo_url || null,
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Team created successfully');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input
        label="Team Name"
        placeholder="Enter team name"
        error={errors.name?.message}
        {...register('name', {
          required: 'Team name is required',
          minLength: {
            value: 2,
            message: 'Team name must be at least 2 characters',
          },
        })}
      />
      
      <Input
        label="Logo URL (optional)"
        placeholder="https://example.com/logo.png"
        error={errors.logo_url?.message}
        {...register('logo_url')}
      />
      
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Add Team
      </Button>
    </form>
  );
}