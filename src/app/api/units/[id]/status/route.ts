import { NextRequest, NextResponse } from 'next/server';
import { UnitModel } from '@/lib/models';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['patrol', 'responding', 'standby', 'staging', 'offline'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const unit = await UnitModel.updateStatus(id, status);

    if (!unit) {
      return NextResponse.json(
        { success: false, error: 'Unit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: unit,
      message: 'Unit status updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update unit status' },
      { status: 500 }
    );
  }
}
