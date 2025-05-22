import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface PlayerFormProps {
  teamId: string;
  onSuccess: () => void;
}

interface PlayerFormData {
  name: string;
}

export default function PlayerForm({ teamId, onSuccess }: PlayerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlayerFormData>();
  
  const onSubmit = async (data: PlayerFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('players')
        .insert({
          team_id: teamId,
          name: data.name,
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Player added successfully');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add player');
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
        label="Player Name"
        placeholder="Enter player name"
        error={errors.name?.message}
        {...register('name', {
          required: 'Player name is required',
          minLength: {
            value: 2,
            message: 'Player name must be at least 2 characters',
          },
        })}
      />
      
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Add Player
      </Button>
    </form>
  );
}