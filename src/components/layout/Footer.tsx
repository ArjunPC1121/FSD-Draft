import { Link } from 'react-router-dom';
import { Trophy, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">MakeMyLeague</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Create and manage custom sports leagues for Cricket, Football, and Badminton.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/view-league" className="text-sm text-muted-foreground hover:text-foreground">
                  View League
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="text-sm text-muted-foreground hover:text-foreground">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MakeMyLeague. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}