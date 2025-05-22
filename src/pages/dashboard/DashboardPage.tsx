import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth';
import { League } from '../../types';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import LeagueCard from '../../components/leagues/LeagueCard';
import Empty from '../../components/ui/Empty';
import toast from 'react-hot-toast';

interface LeagueWithCounts extends League {
  team_count: number;
  match_count: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [leagues, setLeagues] = useState<LeagueWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
  const fetchLeagues = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leagues')
        .select(`
          *,
          team_count:teams(count),
          match_count:matches(count)
        `)
        .eq('admin_id', user.id);

      if (error) throw error;

      setLeagues(
        (data as any[]).map((league) => ({
          ...league,
          team_count: Array.isArray(league.team_count) ? league.team_count[0]?.count ?? 0 : 0,
          match_count: Array.isArray(league.match_count) ? league.match_count[0]?.count ?? 0 : 0,
        }))
      );
    } catch (error) {
      toast.error('Failed to fetch leagues');
    } finally {
      setIsLoading(false);
    }
  };

    
    fetchLeagues();
  }, [user]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">My Leagues</h1>
          <Link to="/leagues/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create League
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : leagues.length === 0 ? (
          <Empty
            title="No leagues yet"
            description="Create your first league to get started"
            actionLabel="Create League"
            onAction={() => window.location.href = '/leagues/create'}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league) => (
              <LeagueCard
                key={league.id}
                league={league}
                teamCount={league.team_count}
                matchCount={league.match_count}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}