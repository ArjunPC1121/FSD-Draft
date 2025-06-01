import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Team, Match } from '../../types';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface MatchFormProps {
  leagueId: string;
  onSuccess: () => void;
  existingMatch?: Match; // For editing existing matches
}

interface MatchFormData {
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  match_time: string;
  home_score?: string;
  away_score?: string;
}

export default function MatchForm({ leagueId, onSuccess, existingMatch }: MatchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MatchFormData>({
    defaultValues: existingMatch ? {
      home_team_id: existingMatch.home_team_id,
      away_team_id: existingMatch.away_team_id,
      match_date: existingMatch.match_date.split('T')[0],
      match_time: existingMatch.match_time,
      home_score: existingMatch.home_score?.toString(),
      away_score: existingMatch.away_score?.toString()
    } : {}
  });

  const homeTeamId = watch('home_team_id');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('league_id', leagueId);
        
        if (error) throw error;
        setTeams(data);
      } catch (error) {
        toast.error('Failed to fetch teams');
      }
    };
    fetchTeams();
  }, [leagueId]);

  useEffect(() => {
    if (existingMatch) {
      setValue('home_team_id', existingMatch.home_team_id);
      setValue('away_team_id', existingMatch.away_team_id);
      setValue('match_date', existingMatch.match_date.split('T')[0]);
      setValue('match_time', existingMatch.match_time);
      if (existingMatch.home_score !== null)
        setValue('home_score', existingMatch.home_score.toString());
      if (existingMatch.away_score !== null)
        setValue('away_score', existingMatch.away_score.toString());
    }
  }, [existingMatch, setValue]);

  const onSubmit = async (data: MatchFormData) => {
    if (data.home_team_id === data.away_team_id) {
      toast.error('Home and away teams must be different');
      return;
    }

    // Validate scores if provided (for editing)
    if (data.home_score || data.away_score) {
      if (!data.home_score || !data.away_score) {
        toast.error('Both scores are required to complete match');
        return;
      }
      if (isNaN(Number(data.home_score)) || isNaN(Number(data.away_score))) {
        toast.error('Scores must be numbers');
        return;
      }
    }

    setIsLoading(true);

    try {
      const matchData = {
        league_id: leagueId,
        home_team_id: data.home_team_id,
        away_team_id: data.away_team_id,
        match_date: data.match_date,
        match_time: data.match_time,
        status: data.home_score && data.away_score ? 'completed' : 'scheduled',
        home_score: data.home_score ? Number(data.home_score) : null,
        away_score: data.away_score ? Number(data.away_score) : null
      };

      if (existingMatch) {
        // Update existing match
        const { error } = await supabase
          .from('matches')
          .update(matchData)
          .eq('id', existingMatch.id);
        if (error) throw error;
      } else {
        // Create new match
        const { error } = await supabase
          .from('matches')
          .insert(matchData);
        if (error) throw error;
      }

      toast.success(existingMatch ? 'Match updated successfully' : 'Match scheduled successfully');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save match');
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Home Team"
        options={teams.map((team) => ({
          value: team.id,
          label: team.name,
        }))}
        error={errors.home_team_id?.message}
        {...register('home_team_id', { required: 'Home team is required' })}
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
        {...register('away_team_id', { required: 'Away team is required' })}
      />

      <Input
        type="date"
        label="Match Date"
        error={errors.match_date?.message}
        {...register('match_date', { required: 'Match date is required' })}
      />

      <Input
        type="time"
        label="Match Time"
        error={errors.match_time?.message}
        {...register('match_time', { required: 'Match time is required' })}
      />

      {existingMatch && (
        <>
          <Input
            type="number"
            label="Home Score"
            error={errors.home_score?.message}
            {...register('home_score', {
              validate: value => !value || !isNaN(Number(value)) || 'Invalid score'
            })}
          />

          <Input
            type="number"
            label="Away Score"
            error={errors.away_score?.message}
            {...register('away_score', {
              validate: value => !value || !isNaN(Number(value)) || 'Invalid score'
            })}
          />
        </>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {existingMatch ? 'Update Match' : 'Schedule Match'}
      </Button>
    </form>
  );
}
