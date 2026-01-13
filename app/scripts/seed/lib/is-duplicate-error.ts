type PayloadError = {
  data?: {
    collection: string;
    errors?: {
      message?: string;
      path?: string;
    }[];
  };
  status: number;
  name: string;
};

export function isDuplicateError(error: unknown): error is PayloadError {
  return (
    !!error &&
    typeof error === "object" &&
    "name" in error &&
    "status" in error &&
    "data" in error
  );
}
