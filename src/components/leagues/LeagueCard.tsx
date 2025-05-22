import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { League } from '../../types';
import { formatDate, sportIcons, sportColors } from '../../lib/utils';
import Button from '../ui/Button';

interface LeagueCardProps {
  league: League;
  teamCount: number;
  matchCount: number;
}

export default function LeagueCard({ league, teamCount, matchCount }: LeagueCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card gradient className="overflow-hidden transition-all hover:shadow-md">
      <div className={`h-2 ${sportColors[league.sport_type]}`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{league.name}</span>
            <span className="text-lg">{sportIcons[league.sport_type]}</span>
          </CardTitle>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {league.code}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{teamCount} Teams</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{matchCount} Matches</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Trophy className="mr-2 h-4 w-4" />
            <span>Created on {formatDate(league.created_at)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/leagues/${league.id}`)}
          className="w-full"
        >
          Manage League
        </Button>
      </CardFooter>
    </Card>
  );
}