import { getSupabaseClient } from './supabaseClient';

export type Proposal = {
  id: number;
  created_at: string;
  text: string;
  upvotes: number;
  downvotes: number;
};

export type ProposalVoteType = 'up' | 'down';

export type Comment = {
  id: number;
  created_at: string;
  proposal_id: number;
  user_name: string | null;
  text: string | null;
};

export async function getProposals(): Promise<Proposal[]> {
  const supabase = getSupabaseClient();
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

export async function createProposal(text: string): Promise<Proposal> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('proposals')
    .insert({ text, upvotes: 0, downvotes: 0 })
    .select()
    .single();

  if (error) {
    console.error('Error creating proposal:', error);
    throw new Error('Failed to create proposal.');
  }

  return data;
}

export async function updateProposalVotes(id: number, newUpvotes: number): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('proposals')
    .update({ upvotes: newUpvotes })
    .eq('id', id);

  if (error) {
    console.error('Error updating proposal votes:', error);
    throw new Error('Failed to update proposal votes.');
  }
}

export async function voteOnProposal(id: number, voteType: ProposalVoteType): Promise<Proposal> {
  const supabase = getSupabaseClient();
  const column: 'upvotes' | 'downvotes' = voteType === 'up' ? 'upvotes' : 'downvotes';

  const { data: currentCounts, error: fetchError } = await supabase
    .from('proposals')
    .select('upvotes, downvotes')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching proposal counts:', fetchError);
    throw new Error('Failed to fetch proposal counts.');
  }

  const currentValue = column === 'upvotes'
    ? currentCounts?.upvotes ?? 0
    : currentCounts?.downvotes ?? 0;

  const nextValue = currentValue + 1;
  const updatePayload = column === 'upvotes'
    ? { upvotes: nextValue }
    : { downvotes: nextValue };

  const { data, error } = await supabase
    .from('proposals')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating proposal vote:', error);
    throw new Error('Failed to update proposal vote.');
  }

  return data as Proposal;
}

export async function getComments(proposalId: number): Promise<Comment[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('proposal_id', proposalId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments.');
  }

  return data || [];
}

type CreateCommentInput = {
  proposalId: number;
  text: string;
  userName?: string;
};

export async function createComment({ proposalId, text, userName }: CreateCommentInput): Promise<Comment> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('comments')
    .insert({ proposal_id: proposalId, text, user_name: userName ?? null })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error('Failed to create comment.');
  }

  return data;
}
