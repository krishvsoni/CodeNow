import { NextRequest, NextResponse } from 'next/server';
import { saveCodeToDB } from '@/lib/saveToDB';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, sessionId, url } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Code is required' },
        { status: 400 }
      );
    }

    const tempId = sessionId || `temp_${nanoid(12)}`;
    
    const result = await saveCodeToDB({ 
      id: tempId, 
      code, 
      url: url || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/${tempId}`,
      isTemporary: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    if (result.success) {
      return NextResponse.json({
        ...result,
        sessionId: tempId,
        isTemporary: true
      }, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Auto-save API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Auto-save failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get the temporary code from database
    const { getCodeFromDB } = await import('@/lib/saveToDB');
    const result = await getCodeFromDB(sessionId);

    return NextResponse.json(result, { 
      status: result.success ? 200 : 404 
    });
  } catch (error) {
    console.error('Auto-save GET API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve auto-saved code',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
