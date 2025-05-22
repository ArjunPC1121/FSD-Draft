import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLeagueCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  return time.slice(0, 5); // Convert "14:30:00" to "14:30"
}

export const sportIcons = {
  Cricket: '🏏',
  Football: '⚽',
  Badminton: '🏸',
};

export const sportColors = {
  Cricket: 'bg-cricket-gradient',
  Football: 'bg-football-gradient',
  Badminton: 'bg-badminton-gradient',
};

export const sportEmptyState = {
  Cricket: 'Create your cricket league to manage teams, schedule matches, and track tournaments.',
  Football: 'Set up your football league to organize teams, fixtures, and keep track of the league table.',
  Badminton: 'Establish your badminton league to manage players, arrange matches, and monitor rankings.',
};