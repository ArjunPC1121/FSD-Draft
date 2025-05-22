import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

export default function LeagueCodeInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      toast.error('Please enter a league code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('id')
        .eq('code', code.toUpperCase())
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        navigate(`/view-league/${code.toUpperCase()}`);
      } else {
        toast.error('League not found');
      }
    } catch (error) {
      toast.error('League not found');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col space-y-4">
      <Input
        label="League Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter 6-character code"
        maxLength={6}
      />
      <Button type="submit" isLoading={isLoading}>
        View League
      </Button>
    </form>
  );
}