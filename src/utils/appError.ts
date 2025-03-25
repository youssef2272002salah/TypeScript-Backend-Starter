export class AppError extends Error {
  public statusCode: number;
  public status: 'fail' | 'error';
  public isOperational: boolean;
  public errorCode?: string;
  public stackTrace?: string;

  constructor(message: string | object, statusCode: number = 500, errorCode?: string) {
    const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;
    super(formattedMessage);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errorCode = errorCode;

    // Capture Stack Trace to get line number
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stackTrace = new Error().stack; // Fallback
    }
  }

  /**
   * Extracts the file and line number where the error occurred.
   */
  getErrorLocation(): string | undefined {
    if (this.stack) {
      const stackLines = this.stack.split('\n');
      const callerLine = stackLines[1]?.trim(); // First stack trace line
      return callerLine; // Example: at someFunction (/path/to/file.js:10:15)
    }
    return undefined;
  }

  /**
   * Formats error for logging or response.
   */
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      errorCode: this.errorCode,
      location: this.getErrorLocation(), // Include file + line number
      stack: this.stackTrace, // Optional: Full stack trace
    };
  }
}
