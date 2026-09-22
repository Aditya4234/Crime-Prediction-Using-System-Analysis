import { NextRequest, NextResponse } from 'next/server';
import { IncidentModel } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incident = await IncidentModel.getById(id);

    if (!incident) {
      return NextResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch incident' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const incident = await IncidentModel.update(id, body);

    if (!incident) {
      return NextResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: incident,
      message: 'Incident updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await IncidentModel.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Incident deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete incident' },
      { status: 500 }
    );
  }
}
