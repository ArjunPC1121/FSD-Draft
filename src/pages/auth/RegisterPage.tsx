import { Trophy } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import RegisterForm from '../../components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export default function RegisterPage() {
  return (
    <Layout>
      <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Get started with MakeMyLeague
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}