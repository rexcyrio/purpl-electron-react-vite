export function stopPropagationToDocument(event: React.KeyboardEvent<HTMLDivElement>): void {
  switch (event.key) {
    case "Escape":
      // allow propagation
      break;

    default:
      event.stopPropagation();
      break;
  }
}
