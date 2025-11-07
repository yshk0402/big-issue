import { NextResponse } from 'next/server';
import { createComment, getComments } from '@/app/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proposalIdParam = searchParams.get('proposalId');
  const proposalId = proposalIdParam ? Number(proposalIdParam) : NaN;

  if (!Number.isFinite(proposalId) || proposalId <= 0) {
    return NextResponse.json({ message: 'proposalId query parameter is required.' }, { status: 400 });
  }

  try {
    const comments = await getComments(proposalId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const proposalId = Number(body?.proposalId);
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const userName = typeof body?.userName === 'string' ? body.userName.trim() : undefined;

    if (!Number.isFinite(proposalId) || proposalId <= 0) {
      return NextResponse.json({ message: 'proposalId must be a positive number.' }, { status: 400 });
    }

    if (!text) {
      return NextResponse.json({ message: 'text is required.' }, { status: 400 });
    }

    const comment = await createComment({ proposalId, text, userName });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to create comment' }, { status: 500 });
  }
}
