import { NextResponse } from 'next/server';
import { UnitModel, MessageModel } from '@/lib/models';

export async function GET() {
  try {
    const units = await UnitModel.getAll();
    const messages = await MessageModel.getAll();

    return NextResponse.json({
      success: true,
      data: { units, messages, total: units.length },
      message: `Found ${units.length} units`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch units' },
      { status: 500 }
    );
  }
}
