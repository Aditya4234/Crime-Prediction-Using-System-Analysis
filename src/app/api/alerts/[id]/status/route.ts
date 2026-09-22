import { NextRequest, NextResponse } from 'next/server';
import { AlertModel } from '@/lib/models';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['responding', 'contained', 'resolved'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be: responding, contained, or resolved' },
        { status: 400 }
      );
    }

    const alert = await AlertModel.updateStatus(id, status);

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'Alert status updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update alert status' },
      { status: 500 }
    );
  }
}
