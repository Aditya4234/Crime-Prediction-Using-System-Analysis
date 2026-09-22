import { NextRequest, NextResponse } from 'next/server';
import { UnitModel } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const unit = await UnitModel.getById(id);

    if (!unit) {
      return NextResponse.json(
        { success: false, error: 'Unit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch unit' },
      { status: 500 }
    );
  }
}
