export class AutoDeviceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "AutoDeviceError";
  }
}

export class AuthenticationError extends AutoDeviceError {
  constructor(message: string) {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends AutoDeviceError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AutoDeviceError {
  constructor(message: string) {
    super(message, 429);
    this.name = "RateLimitError";
  }
}
