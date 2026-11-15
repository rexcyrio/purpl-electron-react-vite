import withErrorHandler from "./withErrorHandler";
import withValidateSender from "./withValidateSender";

export default function withAllMiddlewares(
  fn: (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown>
) {
  const middlewares = [
    withValidateSender,
    // error handler should come last
    withErrorHandler
  ];

  return middlewares.reduceRight((acc, mw) => mw(acc), fn);
}
