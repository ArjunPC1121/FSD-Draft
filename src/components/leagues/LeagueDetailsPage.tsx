import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { supabase } from '../../lib/supabase';
import { League, Team, Match, Player } from '../../types';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TeamForm from '../../components/teams/TeamForm';
import MatchForm from '../../components/matches/MatchForm';
import LeagueCard from '../../components/leagues/LeagueCard';
import { formatDate, sportIcons } from '../../lib/utils';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

export default function LeagueDetailsPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();

  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeagueData = async () => {
    if (!leagueId) return;
    setIsLoading(true);
    try {
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single();
      if (leagueError) throw leagueError;
      setLeague(leagueData as League);

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('league_id', leagueId);
      if (teamsError) throw teamsError;
      setTeams(teamsData as Team[]);

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('league_id', leagueId);
      if (matchesError) throw matchesError;
      setMatches(matchesData as Match[]);

      const teamIds = teamsData?.map(team => team.id) || [];
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .in('team_id', teamIds);
      if (playersError) throw playersError;
      setPlayers(playersData as Player[]);

    } catch (error) {
      toast.error('Failed to fetch league data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagueData();
  }, [leagueId]);

  const getTeamNameById = (teamId: string) => {
    return teams.find(t => t.id === teamId)?.name || 'Unknown Team';
  };

  const handleDeleteLeague = async () => {
    if (!leagueId) return;
    setIsDeleting(true);
    const { error } = await supabase
      .from('leagues')
      .delete()
      .eq('id', leagueId);
    setIsDeleting(false);

    if (error) {
      toast.error('Failed to delete league');
      return;
    }
    toast.success('League deleted');
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!league) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* League Header */}
        <div className="mb-8">
          <LeagueCard 
            league={league}
            teamCount={teams.length}
            matchCount={matches.length}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="flex gap-4">
            <TabsTrigger value="teams">Teams ({teams.length})</TabsTrigger>
            <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Manage Teams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TeamForm leagueId={league.id} onSuccess={fetchLeagueData} />
                {teams.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {teams.map(team => (
                      <Card key={team.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            {team.logo_url && (
                              <img 
                                src={team.logo_url} 
                                alt={team.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            )}
                            {team.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">
                            {players.filter(p => p.team_id === team.id).length} players
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            {/* Matches tab content */}
          </TabsContent>

          <TabsContent value="standings">
            {/* Standings tab content */}
          </TabsContent>
        </Tabs>

        {/* Delete Button at Bottom */}
        <div className="mt-12 flex justify-end">
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete League'}
          </Button>
        </div>

        {/* Modals */}
        {selectedMatch && (
          <Modal
            isOpen={!!selectedMatch}
            onClose={() => setSelectedMatch(null)}
            title="Update Match Result"
          >
            <MatchForm
              leagueId={league.id}
              existingMatch={selectedMatch}
              onSuccess={() => {
                fetchLeagueData();
                setSelectedMatch(null);
              }}
            />
          </Modal>
        )}

        {showDeleteModal && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete League"
          >
            <div className="mb-4">
              <p>Are you sure you want to delete this league? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteLeague}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
