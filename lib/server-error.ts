type ErrorContext = Record<string, unknown>;

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
};

export const logServerError = (
  scope: string,
  error: unknown,
  context?: ErrorContext,
) => {
  console.error(`[${scope}]`, {
    context,
    error: serializeError(error),
  });
};
