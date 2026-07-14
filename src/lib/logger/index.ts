type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

class EnterpriseLogger {
  private formatLog(level: LogLevel, payload: LogPayload): string {
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message: payload.message,
      ...(payload.context ? { context: payload.context } : {}),
      ...(payload.error ? { 
        error: payload.error instanceof Error ? payload.error.message : String(payload.error),
        stack: payload.error instanceof Error ? payload.error.stack : undefined
      } : {}),
    };

    return JSON.stringify(logEntry);
  }

  public info(payload: LogPayload): void {
    console.info(this.formatLog('info', payload));
  }

  public warn(payload: LogPayload): void {
    console.warn(this.formatLog('warn', payload));
  }

  public error(payload: LogPayload): void {
    console.error(this.formatLog('error', payload));
  }

  public debug(payload: LogPayload): void {
    // Exibe debug apenas em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLog('debug', payload));
    }
  }
}

export const logger = new EnterpriseLogger();