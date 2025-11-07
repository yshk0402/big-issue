import { NextResponse } from 'next/server';
import { voteOnProposal, type ProposalVoteType } from '@/app/lib/data';

type RouteContext = {
  params: Record<string, string>;
};

export async function POST(request: Request, context: RouteContext) {
  const proposalId = Number(context.params.id);

  if (!Number.isFinite(proposalId) || proposalId <= 0) {
    return NextResponse.json({ message: 'Invalid proposal id' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => null);
    const voteType = body?.voteType as ProposalVoteType | undefined;

    if (voteType !== 'up' && voteType !== 'down') {
      return NextResponse.json({ message: 'voteType must be "up" or "down"' }, { status: 400 });
    }

    const updatedProposal = await voteOnProposal(proposalId, voteType);
    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to register vote' }, { status: 500 });
  }
}
