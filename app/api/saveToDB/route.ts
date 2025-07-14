import { NextRequest, NextResponse } from 'next/server';
import { saveCodeToDB } from '@/lib/saveToDB';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, code, url, isTemporary = false } = body;

    if (!id || !code) {
      return NextResponse.json(
        { success: false, message: 'ID and code are required' },
        { status: 400 }
      );
    }

    const result = await saveCodeToDB({ 
      id, 
      code, 
      url, 
      isTemporary,
      expiresAt: isTemporary ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined // 24 hours for temporary
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
