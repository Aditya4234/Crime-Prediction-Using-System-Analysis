import { NextRequest, NextResponse } from 'next/server';
import { AlertModel } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alert = await AlertModel.getById(id);

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}
