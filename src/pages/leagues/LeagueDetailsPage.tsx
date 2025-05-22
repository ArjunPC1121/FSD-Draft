import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { supabase } from '../../lib/supabase';
import { League, Team, Match, Player } from '../../types';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TeamForm from '../../components/teams/TeamForm';
import MatchForm from '../../components/matches/MatchForm';
import { formatDate, formatTime, sportIcons } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function LeagueDetailsPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchLeagueData = async () => {
    if (!leagueId) return;
    
    setIsLoading(true);
    
    try {
      // Fetch league details
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
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .in(
          'team_id',
          teamsData.map((team) => team.id)
        );
      
      if (playersError) throw playersError;
      
      setPlayers(playersData as Player[]);
    } catch (error) {
      toast.error('Failed to fetch league data');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeagueData();
  }, [leagueId]);
  
  const getTeamNameById = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Unknown Team';
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
  
  if (!league) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{sportIcons[league.sport_type]}</span>
            <h1 className="text-2xl font-bold md:text-3xl">{league.name}</h1>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {league.sport_type}
            </span>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
              League Code: {league.code}
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1">
            <TabsTrigger
              value="teams"
              className="data-[state=active]:bg-background inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm"
            >
              Teams
            </TabsTrigger>
            <TabsTrigger
              value="matches"
              className="data-[state=active]:bg-background inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm"
            >
              Matches
            </TabsTrigger>
            <TabsTrigger
              value="standings"
              className="data-[state=active]:bg-background inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm"
            >
              Standings
            </TabsTrigger>
          </TabsList>
          
          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                {teams.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="rounded-md bg-muted p-4 text-center">
                        <p className="text-muted-foreground">No teams added yet</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {teams.map((team) => (
                      <Card key={team.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center justify-between">
                            <span>{team.name}</span>
                            {team.logo_url && (
                              <img
                                src={team.logo_url}
                                alt={team.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            )}
                          </CardTitle>
                          <CardDescription>
                            {
                              players.filter((p) => p.team_id === team.id)
                                .length
                            }{' '}
                            Players
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            {players
                              .filter((p) => p.team_id === team.id)
                              .map((player) => (
                                <div
                                  key={player.id}
                                  className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted"
                                >
                                  <span>{player.name}</span>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Add Team</CardTitle>
                    <CardDescription>
                      Add a new team to your league
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TeamForm
                      leagueId={league.id}
                      onSuccess={fetchLeagueData}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                {matches.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="rounded-md bg-muted p-4 text-center">
                        <p className="text-muted-foreground">
                          No matches scheduled yet
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Upcoming Matches */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Matches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {matches
                            .filter((m) => m.status === 'scheduled')
                            .map((match) => (
                              <div
                                key={match.id}
                                className="flex items-center justify-between rounded-md border p-3"
                              >
                                <div>
                                  <div className="font-medium">
                                    {getTeamNameById(match.home_team_id)} vs{' '}
                                    {getTeamNameById(match.away_team_id)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDate(match.match_date)} at{' '}
                                    {formatTime(match.match_time)}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Logic to update match result
                                  }}
                                >
                                  Update Result
                                </Button>
                              </div>
                            ))}
                          {matches.filter((m) => m.status === 'scheduled')
                            .length === 0 && (
                            <div className="text-center text-sm text-muted-foreground">
                              No upcoming matches
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Completed Matches */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Completed Matches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {matches
                            .filter((m) => m.status === 'completed')
                            .map((match) => (
                              <div
                                key={match.id}
                                className="flex items-center justify-between rounded-md border p-3"
                              >
                                <div>
                                  <div className="font-medium">
                                    {getTeamNameById(match.home_team_id)} vs{' '}
                                    {getTeamNameById(match.away_team_id)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDate(match.match_date)}
                                  </div>
                                </div>
                                <div className="text-lg font-semibold">
                                  {match.home_score} - {match.away_score}
                                </div>
                              </div>
                            ))}
                          {matches.filter((m) => m.status === 'completed')
                            .length === 0 && (
                            <div className="text-center text-sm text-muted-foreground">
                              No completed matches
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Match</CardTitle>
                    <CardDescription>
                      Create a new match between teams
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MatchForm
                      leagueId={league.id}
                      onSuccess={fetchLeagueData}
                    />
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
                    Add teams to see standings
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
      </div>
    </Layout>
  );
}