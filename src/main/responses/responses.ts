export interface HttpLikeResponse<T> {
  status: number;
  message: string;
  data: T;
}

export function formatAsOk<T>(data: T): HttpLikeResponse<T> {
  return {
    status: 200,
    message: "",
    data: data
  };
}

export function formatAsBadRequest(error: Error): HttpLikeResponse<null> {
  console.error(error);

  return {
    status: 400,
    message: error.message,
    data: null
  };
}

export function formatAsInternalServerError(error: Error): HttpLikeResponse<null> {
  console.error(error);

  return {
    status: 500,
    message: error.message,
    data: null
  };
}
