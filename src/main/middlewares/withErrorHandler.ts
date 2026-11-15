import { ZodError } from "zod";
import { SecurityError } from "../exceptions/exceptions";
import { formatAsBadRequest, formatAsInternalServerError } from "../responses/responses";

export default function withErrorHandler(
  fn: (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown>
) {
  async function wrapped(event: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    try {
      const result = await fn(event, ...args);
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        return formatAsBadRequest(error);
      }
      if (error instanceof SecurityError) {
        return formatAsInternalServerError(error);
      }
      if (error instanceof Error) {
        return formatAsInternalServerError(error);
      }

      return error;
    }
  }

  return wrapped;
}
