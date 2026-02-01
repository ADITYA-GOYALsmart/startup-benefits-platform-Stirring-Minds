import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Deal from '../../../../models/Deal';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const deal = await Deal.findById(id);

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Check if user can claim this deal
    const user = await getUserFromToken();
    let canClaim = false;

    if (user) {
      // User can claim if deal is not locked or if they have admin privileges
      canClaim = !deal.isLocked;
    }

    return NextResponse.json({
      deal,
      canClaim
    });
  } catch (error) {
    console.error('Get deal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
