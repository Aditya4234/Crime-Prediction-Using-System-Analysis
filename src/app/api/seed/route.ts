import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const db = await connectToDatabase();
    await db.collection('users').deleteMany({});
    await db.collection('incidents').deleteMany({});
    await db.collection('alerts').deleteMany({});
    await db.collection('units').deleteMany({});
    await db.collection('messages').deleteMany({});
    
    await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database reset and re-seeded successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
