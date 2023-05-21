export function stopPropagationToDocument(event: React.KeyboardEvent<HTMLDivElement>): void {
  switch (event.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "e":
    case "q":
    case "?":
    case " ":
      event.stopPropagation();
      break;

    default:
      break;
  }
}
