import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { supabase } from '../../lib/supabase';
import { League, Team, Match, Player } from '../../types';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TeamForm from '../../components/teams/TeamForm';
import MatchForm from '../../components/matches/MatchForm';
import LeagueCard from '../../components/leagues/LeagueCard';
import { formatDate, sportIcons, sportColors } from '../../lib/utils';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

export default function LeagueDetailsPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const fetchLeagueData = async () => {
    if (!leagueId) return;
    setIsLoading(true);
    try {
      // Fetch league
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single();
      if (leagueError) throw leagueError;
      setLeague(leagueData as League);

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('league_id', leagueId);
      if (teamsError) throw teamsError;
      setTeams(teamsData as Team[]);

      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('league_id', leagueId);
      if (matchesError) throw matchesError;
      setMatches(matchesData as Match[]);

      // Fetch players
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

          {/* Teams Tab */}
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

          {/* Matches Tab */}
          <TabsContent value="matches">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                {/* Upcoming Matches */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {matches.filter(m => m.status === 'scheduled').map(match => (
                      <div key={match.id} className="flex items-center justify-between p-3 border-b">
                        <div>
                          <div className="font-medium">
                            {getTeamNameById(match.home_team_id)} vs {getTeamNameById(match.away_team_id)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(match.match_date)} at {match.match_time}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMatch(match)}
                        >
                          Update Result
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Completed Matches */}
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {matches.filter(m => m.status === 'completed').map(match => (
                      <div key={match.id} className="flex items-center justify-between p-3 border-b">
                        <div>
                          {getTeamNameById(match.home_team_id)} {match.home_score} - {match.away_score} {getTeamNameById(match.away_team_id)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(match.match_date)}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Schedule New Match */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule New Match</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MatchForm leagueId={league.id} onSuccess={fetchLeagueData} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Standings Tab */}
<TabsContent value="standings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>League Standings</CardTitle>
              </CardHeader>
              <CardContent>
                {teams.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground">
                    No teams added yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Team</th>
                          <th className="px-4 py-2 text-center">P</th>
                          <th className="px-4 py-2 text-center">W</th>
                          <th className="px-4 py-2 text-center">D</th>
                          <th className="px-4 py-2 text-center">L</th>
                          <th className="px-4 py-2 text-center">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teams.map((team) => {
                          const teamMatches = matches.filter(
                            (m) =>
                              (m.home_team_id === team.id ||
                                m.away_team_id === team.id) &&
                              m.status === 'completed'
                          );
                          
                          let wins = 0;
                          let draws = 0;
                          let losses = 0;
                          
                          teamMatches.forEach((match) => {
                            if (
                              match.home_team_id === team.id &&
                              match.home_score !== null &&
                              match.away_score !== null
                            ) {
                              if (match.home_score > match.away_score) {
                                wins++;
                              } else if (
                                match.home_score === match.away_score
                              ) {
                                draws++;
                              } else {
                                losses++;
                              }
                            } else if (
                              match.away_team_id === team.id &&
                              match.home_score !== null &&
                              match.away_score !== null
                            ) {
                              if (match.away_score > match.home_score) {
                                wins++;
                              } else if (
                                match.away_score === match.home_score
                              ) {
                                draws++;
                              } else {
                                losses++;
                              }
                            }
                          });
                          
                          const points = wins * 3 + draws;
                          
                          return (
                            <tr key={team.id} className="border-b">
                              <td className="px-4 py-2">{team.name}</td>
                              <td className="px-4 py-2 text-center">
                                {teamMatches.length}
                              </td>
                              <td className="px-4 py-2 text-center">{wins}</td>
                              <td className="px-4 py-2 text-center">{draws}</td>
                              <td className="px-4 py-2 text-center">{losses}</td>
                              <td className="px-4 py-2 text-center font-semibold">
                                {points}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Match Update Modal */}
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
      </div>
    </Layout>
  );
}
