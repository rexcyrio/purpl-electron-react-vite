export function senderIsValid(frame: Electron.WebFrameMain): boolean {
  const url = new URL(frame.url);
  return url.hostname === "localhost";
}
