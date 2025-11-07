import { NextResponse } from 'next/server';
import { getProposals, createProposal } from '@/app/lib/data';

export async function GET() {
  try {
    const proposals = await getProposals();
    return NextResponse.json(proposals);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to fetch proposals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json({ message: 'Text is required.' }, { status: 400 });
    }

    const proposal = await createProposal(text);
    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to create proposal' }, { status: 500 });
  }
}
