import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Claim from '../../../../models/Claim';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's claims with populated deal information
    const claims = await Claim.find({ userId: user.userId })
      .populate('dealId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ claims });
  } catch (error) {
    console.error('Get user claims error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { dealId } = body;

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // Check if claim already exists
    const existingClaim = await Claim.findOne({
      userId: user.userId,
      dealId: dealId
    });

    if (existingClaim) {
      return NextResponse.json(
        { error: 'Claim already exists for this deal' },
        { status: 400 }
      );
    }

    // Create new claim
    const claim = await Claim.create({
      userId: user.userId,
      dealId: dealId,
      status: 'pending'
    });

    // Populate deal information
    await claim.populate('dealId');

    return NextResponse.json({
      claim,
      message: 'Claim submitted successfully'
    });
  } catch (error) {
    console.error('Create claim error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
