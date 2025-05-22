import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Team } from '../../types';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface MatchFormProps {
  leagueId: string;
  onSuccess: () => void;
}

interface MatchFormData {
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  match_time: string;
}

export default function MatchForm({ leagueId, onSuccess }: MatchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MatchFormData>();
  
  const homeTeamId = watch('home_team_id');
  
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('league_id', leagueId);
        
        if (error) {
          throw error;
        }
        
        setTeams(data);
      } catch (error) {
        toast.error('Failed to fetch teams');
      }
    };
    
    fetchTeams();
  }, [leagueId]);
  
  const onSubmit = async (data: MatchFormData) => {
    if (data.home_team_id === data.away_team_id) {
      toast.error('Home and away teams must be different');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('matches')
        .insert({
          league_id: leagueId,
          home_team_id: data.home_team_id,
          away_team_id: data.away_team_id,
          match_date: data.match_date,
          match_time: data.match_time,
          status: 'scheduled',
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Match scheduled successfully');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule match');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (teams.length < 2) {
    return (
      <div className="rounded-md bg-secondary p-4 text-sm">
        You need at least two teams to schedule matches.
      </div>
    );
  }
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Select
        label="Home Team"
        options={teams.map((team) => ({
          value: team.id,
          label: team.name,
        }))}
        error={errors.home_team_id?.message}
        {...register('home_team_id', {
          required: 'Home team is required',
        })}
      />
      
      <Select
        label="Away Team"
        options={teams
          .filter((team) => team.id !== homeTeamId)
          .map((team) => ({
            value: team.id,
            label: team.name,
          }))}
        error={errors.away_team_id?.message}
        {...register('away_team_id', {
          required: 'Away team is required',
        })}
      />
      
      <Input
        type="date"
        label="Match Date"
        error={errors.match_date?.message}
        {...register('match_date', {
          required: 'Match date is required',
        })}
      />
      
      <Input
        type="time"
        label="Match Time"
        error={errors.match_time?.message}
        {...register('match_time', {
          required: 'Match time is required',
        })}
      />
      
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Schedule Match
      </Button>
    </form>
  );
}