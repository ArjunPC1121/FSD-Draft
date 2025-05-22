import { useState } from 'react';
import { Trophy } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LeagueCodeInput from '../../components/leagues/LeagueCodeInput';
import { motion } from 'framer-motion';

export default function ViewLeaguePage() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Layout>
      <div className="container mx-auto flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">View a League</h1>
          <p className="text-muted-foreground">
            Enter a league code to view teams, matches, and standings
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <LeagueCodeInput />
        </motion.div>
      </div>
    </Layout>
  );
}