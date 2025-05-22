import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { sportIcons } from '../lib/utils';

export default function HomePage() {
  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/70 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Create & Manage<br />
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Sports Leagues</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              MakeMyLeague helps you organize Cricket, Football, and Badminton leagues with teams, matches, and standings. Share your league with a simple code.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
              <Link to="/auth/register">
                <Button size="lg">
                  Create Your League
                </Button>
              </Link>
              <Link to="/view-league">
                <Button size="lg" variant="outline">
                  View a League
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {Object.entries(sportIcons).map(([sport, icon]) => (
                <Card key={sport} gradient className="overflow-hidden border-none shadow-md">
                  <div className={`h-2 bg-${sport.toLowerCase()}-gradient`} />
                  <CardContent className="p-6 text-center">
                    <span className="mb-4 inline-block text-4xl">{icon}</span>
                    <h3 className="mb-2 text-xl font-semibold">{sport}</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and manage {sport.toLowerCase()} leagues with teams, matches, and standings.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              MakeMyLeague simplifies sports league management with powerful features that help you organize games and keep track of your league.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create Leagues</h3>
              <p className="text-muted-foreground">
                Set up your custom league for Cricket, Football, or Badminton in seconds.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Manage Teams</h3>
              <p className="text-muted-foreground">
                Add team details, player information, and customize your roster.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Schedule Matches</h3>
              <p className="text-muted-foreground">
                Create fixtures, update scores, and track match results easily.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Share Access</h3>
              <p className="text-muted-foreground">
                Share your league with a unique code for read-only access.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Create your league today and experience the easiest way to manage sports competitions.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link to="/auth/register">
              <Button size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}