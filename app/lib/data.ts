import { supabase } from './supabaseClient';

export type Proposal = {
  id: number;
  created_at: string;
  text: string;
  upvotes: number;
  downvotes: number;
};

export async function getProposals(): Promise<Proposal[]> {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proposals:', error);
    throw new Error('Failed to fetch proposals.');
  }

  return data || [];
}
