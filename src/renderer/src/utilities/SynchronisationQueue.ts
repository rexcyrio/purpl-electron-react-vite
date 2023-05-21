import { AssertionError } from "@renderer/utilities/assertion";
import { sleep } from "@renderer/utilities/sleep";

export class SynchronisationQueue {
  private queue: Ticket[];

  constructor() {
    this.queue = [];
  }

  generateTicket(): Ticket {
    return new Ticket();
  }

  peekFirst(): Ticket {
    const ticket = this.queue.at(0);

    if (ticket === undefined) {
      throw new AssertionError();
    }

    return ticket;
  }

  peekLast(): Ticket {
    const ticket = this.queue.at(-1);

    if (ticket === undefined) {
      throw new AssertionError();
    }

    return ticket;
  }

  enqueue(ticket: Ticket): void {
    this.queue.push(ticket);
  }

  dequeue(ticket: Ticket): void {
    if (this.peekFirst() !== ticket) {
      throw new AssertionError();
    }

    this.queue.shift();
  }

  async waitTillMyTurn(ticket: Ticket): Promise<void> {
    let count = 0;

    while (this.peekFirst() !== ticket) {
      count += 1;
      await sleep(count);
    }
  }

  isAborted(ticket: Ticket): boolean {
    return this.peekLast() !== ticket;
  }
}

class Ticket {}
