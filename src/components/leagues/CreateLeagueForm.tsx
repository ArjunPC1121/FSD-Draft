import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth';
import { Sport } from '../../types';
import { generateLeagueCode } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import toast from 'react-hot-toast';

interface CreateLeagueFormData {
  name: string;
  sport_type: Sport;
}

export default function CreateLeagueForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeagueFormData>({
    defaultValues: {
      sport_type: 'Cricket',
    },
  });
  
  const onSubmit = async (data: CreateLeagueFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a league');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const code = generateLeagueCode();
      
      const { data: league, error } = await supabase
        .from('leagues')
        .insert({
          name: data.name,
          sport_type: data.sport_type,
          code,
          admin_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('League created successfully');
      navigate(`/leagues/${league.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create league');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-4">
        <Input
          label="League Name"
          placeholder="Enter league name"
          error={errors.name?.message}
          {...register('name', {
            required: 'League name is required',
            minLength: {
              value: 3,
              message: 'League name must be at least 3 characters',
            },
          })}
        />
        
        <Select
          label="Sport Type"
          error={errors.sport_type?.message}
          options={[
            { value: 'Cricket', label: 'Cricket 🏏' },
            { value: 'Football', label: 'Football ⚽' },
            { value: 'Badminton', label: 'Badminton 🏸' },
          ]}
          {...register('sport_type', {
            required: 'Sport type is required',
          })}
        />
      </div>
      
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create League
      </Button>
    </form>
  );
}