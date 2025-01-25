import { HttpsStatusCode, HTTPSTATUS } from "../config/http.config";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enum";

export class ApiError extends Error {
  public statusCode: HttpsStatusCode;
  public errorCode?: ErrorCodeEnumType;

  constructor(
    message: string,
    statusCode: HttpsStatusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends ApiError {
  constructor(
    message = "Http Exception Error",
    statusCode: HttpsStatusCode,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message, statusCode, errorCode);
  }
}

export class InternalServerException extends ApiError {
  constructor(
    message = "Internal Server Error",
    errorCode?: ErrorCodeEnumType
  ) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }
}

export class NotFoundException extends ApiError {
  constructor(message = "Resource not found", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestException extends ApiError {
  constructor(message = "Bad Request", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCodeEnum.VALIDATION_ERROR
    );
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
}
