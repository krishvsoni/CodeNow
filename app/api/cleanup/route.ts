import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error('DB_URL is not defined in environment variables');
    }
    
    await mongoose.connect(dbUrl);
    isConnected = true;
    console.log('MongoDB connected successfully for cleanup');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Code Schema (redefine for cleanup)
const CodeSchema = new mongoose.Schema({
  id: String,
  code: String,
  url: String,
  isTemporary: Boolean,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
});

const Code = mongoose.models.Code || mongoose.model('Code', CodeSchema);

// Simple cleanup function for expired temporary entries
export async function POST() {
  try {
    await connectDB();
    
    // Delete temporary entries that have expired
    const result = await Code.deleteMany({
      isTemporary: true,
      expiresAt: { $lt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired temporary entries`,
      deletedCount: result.deletedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Cleanup API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Cleanup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get cleanup status and count of temporary entries
export async function GET() {
  try {
    await connectDB();
    
    const now = new Date();
    const tempCount = await Code.countDocuments({
      isTemporary: true
    });
    
    const expiredCount = await Code.countDocuments({
      isTemporary: true,
      expiresAt: { $lt: now }
    });

    return NextResponse.json({
      success: true,
      temporaryEntries: tempCount,
      expiredEntries: expiredCount,
      timestamp: now
    }, { status: 200 });
  } catch (error) {
    console.error('Cleanup status API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get cleanup status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
