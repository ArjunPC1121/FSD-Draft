import { AlertCircle } from 'lucide-react';
import Button from './Button';

interface EmptyProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Empty({ 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
      <div className="rounded-full bg-secondary p-3">
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="mt-4"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}