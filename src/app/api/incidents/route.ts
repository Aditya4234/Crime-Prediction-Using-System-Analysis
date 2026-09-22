import { NextRequest, NextResponse } from 'next/server';
import { IncidentModel } from '@/lib/models';

export async function GET() {
  try {
    const incidents = await IncidentModel.getAll();
    return NextResponse.json({
      success: true,
      data: incidents,
      message: `Found ${incidents.length} incidents`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, severity, location, victim, suspect, description } = body;

    if (!type || !severity || !location || !victim) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, severity, location, victim' },
        { status: 400 }
      );
    }

    const incident = await IncidentModel.create({ type, severity, location, victim, suspect, description });

    return NextResponse.json({
      success: true,
      data: incident,
      message: 'Incident created successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create incident' },
      { status: 500 }
    );
  }
}
