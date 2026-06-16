import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      'Ha ocurrido un error interno en el servidor. Por favor, contacte al administrador.';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        if (Array.isArray(resp.message)) {
          message = (resp.message as string[]).join(', ');
        } else if (resp.message) {
          message = resp.message as string;
        }
        if (resp.error) {
          error = resp.error as string;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (status < 500) {
        this.logger.warn(
          `HTTP ${status} - ${request.method} ${request.url} - ${message}`,
        );
      } else {
        this.logger.error(
          `HTTP ${status} - ${request.method} ${request.url} - ${message}`,
          exception instanceof Error ? exception.stack : '',
        );
      }
    } else {
      this.logger.error(
        `Unhandled exception - ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
    });
  }
}
