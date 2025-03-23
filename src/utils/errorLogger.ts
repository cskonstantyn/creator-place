/**
 * Error logging utility for consistent error handling across the application.
 * This can be extended to send errors to external monitoring services like Sentry.
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error contexts or categories
export enum ErrorContext {
  DATABASE = 'database',
  API = 'api',
  AUTH = 'authentication',
  PAYMENT = 'payment',
  UI = 'user-interface',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

export interface ErrorLogOptions {
  // Additional contextual information about the error
  details?: Record<string, any>;
  // Should this error be reported to monitoring service
  report?: boolean;
  // User info to associate with the error
  user?: {
    id?: string;
    email?: string;
  };
  // Tags to categorize the error
  tags?: string[];
}

/**
 * Log an error with structured metadata
 */
export function logError(
  error: Error | string,
  context: ErrorContext = ErrorContext.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  options: ErrorLogOptions = { report: true }
): void {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Create structured error object
  const errorData = {
    timestamp: new Date().toISOString(),
    message: errorMessage,
    context,
    severity,
    stack: errorStack,
    ...options,
  };
  
  // Always log to console in development
  if (process.env.NODE_ENV !== 'production') {
    // Color code the console output based on severity
    const colors = {
      [ErrorSeverity.INFO]: '\x1b[36m%s\x1b[0m', // Cyan
      [ErrorSeverity.WARNING]: '\x1b[33m%s\x1b[0m', // Yellow
      [ErrorSeverity.ERROR]: '\x1b[31m%s\x1b[0m', // Red
      [ErrorSeverity.CRITICAL]: '\x1b[41m\x1b[37m%s\x1b[0m', // White on red background
    };
    
    console.log(colors[severity], `[${severity.toUpperCase()}] [${context}]`, errorMessage);
    if (errorStack) {
      console.log(errorStack);
    }
    if (options.details) {
      console.log('Details:', options.details);
    }
  } else {
    // In production, just log a clean version
    console.error(`[${severity}] [${context}]: ${errorMessage}`);
  }
  
  // Send to external monitoring service if needed
  if (options.report) {
    // TODO: Integrate with Sentry or other monitoring services
    // Example:
    // Sentry.captureException(error, {
    //   level: severity,
    //   tags: { context, ...(options.tags && { tags: options.tags }) },
    //   user: options.user,
    //   extra: options.details,
    // });
  }
}

/**
 * Create a handler for API errors
 */
export function createApiErrorHandler(context: string) {
  return (error: any, details?: Record<string, any>) => {
    logError(
      error, 
      ErrorContext.API, 
      ErrorSeverity.ERROR, 
      { 
        details: { 
          apiContext: context,
          ...details
        } 
      }
    );
    
    // Return a standardized error response for API handlers
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'API_ERROR',
    };
  };
}

/**
 * Create a database error handler
 */
export function createDatabaseErrorHandler(table: string) {
  return (error: any, operation: string, details?: Record<string, any>) => {
    logError(
      error, 
      ErrorContext.DATABASE, 
      ErrorSeverity.ERROR, 
      { 
        details: { 
          table,
          operation,
          ...details
        } 
      }
    );
    
    return null; // Return null for database operations that should return null on error
  };
}

/**
 * Log authentication-related errors
 */
export function logAuthError(error: Error | string, details?: Record<string, any>) {
  logError(
    error,
    ErrorContext.AUTH,
    ErrorSeverity.WARNING,
    { details }
  );
}

/**
 * Log payment-related errors
 */
export function logPaymentError(error: Error | string, details?: Record<string, any>) {
  logError(
    error,
    ErrorContext.PAYMENT,
    ErrorSeverity.ERROR,
    { 
      details,
      report: true // Always report payment errors
    }
  );
}

export default {
  logError,
  createApiErrorHandler,
  createDatabaseErrorHandler,
  logAuthError,
  logPaymentError,
}; 