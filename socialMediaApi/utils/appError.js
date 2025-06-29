class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "Server Error";
    this.isOptional = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
