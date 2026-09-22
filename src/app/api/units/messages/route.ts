import { NextRequest, NextResponse } from 'next/server';
import { MessageModel } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const messages = limit ? await MessageModel.getRecent(limit) : await MessageModel.getAll();

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, msg, priority } = body;

    if (!from || !msg) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: from, msg' },
        { status: 400 }
      );
    }

    const message = await MessageModel.create(from, msg, priority);

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message sent successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
