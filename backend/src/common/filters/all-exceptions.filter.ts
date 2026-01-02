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
  private readonly logger = new Logger('AllExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request['requestId'] || 'N/A';

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.getResponse()
      : (exception as Error).message || 'Internal server error';

    const logContext = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.get('user-agent'),
      body: request.body,
      query: request.query,
      params: request.params,
      message: message,
      stack: exception instanceof Error ? exception.stack : null,
    };

    // PHÂN BIỆT LỖI:
    // 1. Lỗi hệ thống (System Error): Các lỗi crash code (không phải HttpException) hoặc lỗi 500+
    // 2. Lỗi nghiệp vụ (Business Error): Các lỗi 4xx (Sai pass, thiếu dữ liệu...)
    const isSystemError =
      !isHttpException || status >= HttpStatus.INTERNAL_SERVER_ERROR;

    if (isSystemError) {
      this.logger.error(
        `[SYSTEM_ERROR][${requestId}] ${request.method} ${request.url} ${status}`,
        JSON.stringify(logContext, null, 2),
      );
    } else {
      // Log lỗi nghiệp vụ ở mức độ WARN để không làm loãng log ERROR
      this.logger.warn(
        `[BUSINESS_ERROR][${requestId}] ${request.method} ${request.url} ${status} - ${JSON.stringify(message)}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      message:
        typeof message === 'object' && 'message' in message
          ? message['message']
          : message,
    });
  }
}
