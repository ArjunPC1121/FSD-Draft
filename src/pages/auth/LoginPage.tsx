import { Trophy } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LoginForm from '../../components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export default function LoginPage() {
  return (
    <Layout>
      <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your MakeMyLeague account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}