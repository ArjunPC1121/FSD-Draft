import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import TeamForm from "../teams/TeamForm";
import PlayerForm from "../players/PlayerForm";
import MatchForm from "../matches/MatchForm";
import { League, Team, Match, Player } from "../../types";
import toast from "react-hot-toast";

export default function LeagueDetailsPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [playersByTeam, setPlayersByTeam] = useState<Record<string, Player[]>>({});

  useEffect(() => {
    if (!leagueId) return;
    const fetchLeague = async () => {
      const { data, error } = await supabase.from("leagues").select("*").eq("id", leagueId).single();
      if (error) {
        toast.error("Failed to fetch league");
      } else {
        setLeague(data);
      }
    };
    fetchLeague();
  }, [leagueId]);

  const fetchTeams = async () => {
    if (!leagueId) return;
    const { data, error } = await supabase.from("teams").select("*").eq("league_id", leagueId);
    if (error) {
      toast.error("Failed to fetch teams");
    } else {
      setTeams(data || []);
    }
  };

  const fetchMatches = async () => {
    if (!leagueId) return;
    const { data, error } = await supabase.from("matches").select("*").eq("league_id", leagueId);
    if (error) {
      toast.error("Failed to fetch matches");
    } else {
      setMatches(data || []);
    }
  };

  const fetchPlayers = async (teamIds: string[]) => {
    if (teamIds.length === 0) return;
    const { data, error } = await supabase.from("players").select("*").in("team_id", teamIds);
    if (error) {
      toast.error("Failed to fetch players");
    } else {
      const grouped: Record<string, Player[]> = {};
      for (const teamId of teamIds) grouped[teamId] = [];
      for (const player of data || []) {
        if (grouped[player.team_id]) grouped[player.team_id].push(player);
      }
      setPlayersByTeam(grouped);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchMatches();
  }, [leagueId]);

  useEffect(() => {
    if (teams.length > 0) fetchPlayers(teams.map((t) => t.id));
  }, [teams]);

  if (!league) return <div className="p-8">Loading league...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{league.name} ({league.sport_type})</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create Team</h2>
        <TeamForm leagueId={leagueId!} onSuccess={fetchTeams} />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Teams & Players</h2>
        {teams.length === 0 && <div>No teams yet.</div>}
        {teams.map((team) => (
          <div key={team.id} className="border rounded p-4 mb-4">
            <div className="font-semibold">{team.name}</div>
            <div className="ml-4 mt-2">
              <PlayerForm teamId={team.id} onSuccess={() => fetchPlayers(teams.map((t) => t.id))} />
              <div className="mt-2">
                <div className="font-medium">Players:</div>
                <ul className="list-disc ml-6">
                  {(playersByTeam[team.id] || []).map((player) => (
                    <li key={player.id}>{player.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Schedule Match</h2>
        <MatchForm leagueId={leagueId!} onSuccess={fetchMatches} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Matches</h2>
        {matches.length === 0 && <div>No matches scheduled yet.</div>}
        <ul className="list-disc ml-6">
          {matches.map((match) => (
            <li key={match.id}>
              {match.match_date} {match.match_time} — {match.home_team_id} vs {match.away_team_id}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
