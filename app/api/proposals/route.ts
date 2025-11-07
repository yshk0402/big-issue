import { NextResponse } from 'next/server';
import { getProposals } from '@/app/lib/data';

export async function GET() {
  try {
    const proposals = await getProposals();
    return NextResponse.json(proposals);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to fetch proposals' }, { status: 500 });
  }
}
