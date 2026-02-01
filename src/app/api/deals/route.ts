import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Deal from '../../../models/Deal';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { partnerName: { $regex: search, $options: 'i' } },
      ];
    }

    const deals = await Deal.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Get deals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
