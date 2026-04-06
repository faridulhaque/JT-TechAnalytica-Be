import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

type ErrorResponse = {
  code?: number | string;
  errorMessage?: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse = exception.getResponse() as string | ErrorResponse;

    const custom_code =
      typeof rawResponse === 'string'
        ? exception.cause
        : rawResponse.code ?? exception.cause;

    const message =
      typeof rawResponse === 'string'
        ? rawResponse
        : rawResponse.errorMessage ?? exception.message;

    const logErrorResponse = {
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    const errorResponse = {
      status,
      code: custom_code,
      errorMessage: message,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'ExceptionFilter',
      );
    } else {
      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(logErrorResponse),
        'ExceptionFilter',
      );
    }

    response.status(status).json(errorResponse);
  }
}