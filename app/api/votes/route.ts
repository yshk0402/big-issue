import { NextResponse } from 'next/server';
import { getBigIssueCounts, getBigIssueVoteChoice, submitBigIssueVote, type ProposalVoteType } from '@/app/lib/data';

const isValidChoice = (value: string): value is ProposalVoteType => value === 'agree' || value === 'disagree';
const isValidUuid = (value: string | null): value is string =>
  typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');
    const userId = isValidUuid(userIdParam) ? userIdParam : null;
    const counts = await getBigIssueCounts();
    const choice = userId ? await getBigIssueVoteChoice(userId) : null;

    return NextResponse.json({ counts, choice });
  } catch (error) {
    console.error('API Error (GET /api/votes):', error);
    return NextResponse.json({ message: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const userId = typeof body?.userId === 'string' ? body.userId : '';
    const voteType = typeof body?.choice === 'string' ? body.choice : '';

    if (!isValidUuid(userId) || !isValidChoice(voteType)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const counts = await submitBigIssueVote(userId, voteType);
    return NextResponse.json({ counts, choice: voteType });
  } catch (error) {
    console.error('API Error (POST /api/votes):', error);
    return NextResponse.json({ message: 'Failed to submit vote' }, { status: 500 });
  }
}
