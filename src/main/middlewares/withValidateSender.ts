import { SecurityError } from "../exceptions/exceptions";

export default function withValidateSender(
  fn: (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown>
) {
  async function wrapped(event: Electron.IpcMainInvokeEvent, ...args: unknown[]) {
    const senderUrl = event.senderFrame?.url || "";

    if (senderUrl !== "http://localhost:5173/") {
      throw new SecurityError("Unauthorized IPC frame source");
    }

    const result = await fn(event, ...args);
    return result;
  }

  return wrapped;
}
