import { NextRequest, NextResponse } from 'next/server';
import { AlertModel } from '@/lib/models';

export async function GET() {
  try {
    const alerts = await AlertModel.getAll();
    return NextResponse.json({
      success: true,
      data: alerts,
      message: `Found ${alerts.length} alerts`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, type, location, priority } = body;

    if (!type || !location) {
      return NextResponse.json(
        { success: false, error: 'Type and location are required' },
        { status: 400 }
      );
    }

    const alert = await AlertModel.create({
      code: code || 'CODE-1',
      type,
      location,
      priority: priority || 'medium',
      status: 'responding',
      units: [],
      time: 'Just now',
      dispatchedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'Alert created successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
