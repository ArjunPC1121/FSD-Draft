import { Link } from 'react-router-dom';
import { Trophy, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:space-x-12 text-center md:text-left">
          {/* Logo and description */}
          <div className="md:w-3/5 mb-6 md:mb-0">
            <Link to="/" className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">MakeMyLeague</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create and manage custom sports leagues for Cricket, Football, and Badminton.
            </p>
          </div>

          {/* Connect section */}
          <div className="md:w-2/5 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/ArjunPC1121/FSD-Draft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start space-x-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MakeMyLeague. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
