import withErrorHandlerAsync from "./withErrorHandlerAsync";
import withValidateSenderAsync from "./withValidateSenderAsync";

export default function withAllMiddlewaresAsync(
  fn: (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown>
) {
  const middlewares = [
    withValidateSenderAsync,
    // error handler should come last
    withErrorHandlerAsync
  ];

  return middlewares.reduceRight((acc, mw) => mw(acc), fn);
}
