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
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Code Schema
const CodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: null
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: null,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

CodeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Code = mongoose.models.Code || mongoose.model('Code', CodeSchema);

export interface SaveCodeData {
  id: string;
  code: string;
  url?: string;
  isTemporary?: boolean;
  expiresAt?: Date;
}

export interface CodeData {
  id: string;
  code?: string;
  url?: string;
  isTemporary?: boolean;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SaveCodeResponse {
  success: boolean;
  message: string;
  data?: CodeData;
  error?: string;
}


export const saveCodeToDB = async (codeData: SaveCodeData): Promise<SaveCodeResponse> => {
  try {
    await connectDB();
    
    const { id, code, url, isTemporary = false, expiresAt } = codeData;
    
    // Validate required fields
    if (!id || !code) {
      return {
        success: false,
        message: 'ID and code are required fields',
        error: 'Missing required fields'
      };
    }
    
    const existingCode = await Code.findOne({ id });
    
    if (existingCode) {
      existingCode.code = code;
      existingCode.url = url || existingCode.url;
      existingCode.updatedAt = new Date();
      
      if (!existingCode.isTemporary || !isTemporary) {
        existingCode.isTemporary = isTemporary;
        existingCode.expiresAt = expiresAt || null;
      }
      
      const updatedCode = await existingCode.save();
      
      return {
        success: true,
        message: 'Code updated successfully',
        data: {
          id: updatedCode.id,
          url: updatedCode.url,
          isTemporary: updatedCode.isTemporary,
          expiresAt: updatedCode.expiresAt,
          updatedAt: updatedCode.updatedAt
        }
      };
    } else {
      // Create new code entry
      const newCode = new Code({
        id,
        code,
        url: url || null,
        isTemporary,
        expiresAt: isTemporary ? (expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000)) : null // 24 hours for temporary
      });
      
      const savedCode = await newCode.save();
      
      return {
        success: true,
        message: 'Code saved successfully',
        data: {
          id: savedCode.id,
          url: savedCode.url,
          isTemporary: savedCode.isTemporary,
          expiresAt: savedCode.expiresAt,
          createdAt: savedCode.createdAt
        }
      };
    }
  } catch (error) {
    console.error('Error saving code to database:', error);
    
    // Handle specific mongoose errors
    if (error instanceof mongoose.Error.ValidationError) {
      return {
        success: false,
        message: 'Validation error',
        error: error.message
      };
    }
    
    if (error instanceof mongoose.Error.CastError) {
      return {
        success: false,
        message: 'Invalid data format',
        error: error.message
      };
    }
    
    return {
      success: false,
      message: 'Failed to save code to database',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get code from MongoDB database by ID
 * @param id - The unique ID of the code
 * @returns Promise with code data or error
 */
export const getCodeFromDB = async (id: string): Promise<SaveCodeResponse> => {
  try {
    // Connect to database
    await connectDB();
    
    if (!id) {
      return {
        success: false,
        message: 'ID is required',
        error: 'Missing ID parameter'
      };
    }
    
    const codeDoc = await Code.findOne({ id });
    
    if (!codeDoc) {
      return {
        success: false,
        message: 'Code not found',
        error: 'No code found with the provided ID'
      };
    }      return {
        success: true,
        message: 'Code retrieved successfully',
        data: {
          id: codeDoc.id,
          code: codeDoc.code,
          url: codeDoc.url,
          isTemporary: codeDoc.isTemporary,
          expiresAt: codeDoc.expiresAt,
          createdAt: codeDoc.createdAt,
          updatedAt: codeDoc.updatedAt
        }
      };
  } catch (error) {
    console.error('Error getting code from database:', error);
    
    return {
      success: false,
      message: 'Failed to retrieve code from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Delete code from MongoDB database by ID
 * @param id - The unique ID of the code to delete
 * @returns Promise with success/failure response
 */
export const deleteCodeFromDB = async (id: string): Promise<SaveCodeResponse> => {
  try {
    // Connect to database
    await connectDB();
    
    if (!id) {
      return {
        success: false,
        message: 'ID is required',
        error: 'Missing ID parameter'
      };
    }
    
    const deletedCode = await Code.findOneAndDelete({ id });
    
    if (!deletedCode) {
      return {
        success: false,
        message: 'Code not found',
        error: 'No code found with the provided ID'
      };
    }
    
    return {
      success: true,
      message: 'Code deleted successfully',
      data: {
        id: deletedCode.id,
        deletedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Error deleting code from database:', error);
    
    return {
      success: false,
      message: 'Failed to delete code from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};