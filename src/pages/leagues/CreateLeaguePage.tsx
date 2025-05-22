import Layout from '../../components/layout/Layout';
import CreateLeagueForm from '../../components/leagues/CreateLeagueForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export default function CreateLeaguePage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Create New League</CardTitle>
            <CardDescription>
              Set up a new sports league for Cricket, Football, or Badminton
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateLeagueForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}