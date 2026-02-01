import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Claim from '../../../models/Claim';
import Deal from '../../../models/Deal';
import { claimSchema } from '../../../lib/validators';
import { verifyToken } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify JWT
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { dealId } = claimSchema.parse(body);

    // Check if deal exists
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Check if user is verified for locked deals
    if (deal.isLocked) {
      const User = (await import('../../../models/User')).default;
      const user = await User.findById(payload.userId);
      if (!user?.isVerified) {
        return NextResponse.json(
          { error: 'Verification required for locked deals' },
          { status: 403 }
        );
      }
    }

    // Check if already claimed
    const existingClaim = await Claim.findOne({
      userId: payload.userId,
      dealId,
    });
    if (existingClaim) {
      return NextResponse.json(
        { error: 'Deal already claimed' },
        { status: 409 }
      );
    }

    // Create claim
    const claim = await Claim.create({
      userId: payload.userId,
      dealId,
    });

    return NextResponse.json({ claim });
  } catch (error) {
    console.error('Claim error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
