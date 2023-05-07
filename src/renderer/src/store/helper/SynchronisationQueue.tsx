export class SynchronisationQueue {
  private name: string;
  private queue: Ticket[];

  constructor(name: string) {
    this.name = name;
    this.queue = [];
  }

  generateTicket(): Ticket {
    return new Ticket();
  }

  enqueue(ticket: Ticket): void {
    this.queue.push(ticket);
  }

  dequeue(ticket: Ticket): void {
    if (this.queue[0] === ticket) {
      this.queue.shift();
    } else {
      throw new Error(
        `SynchronisationQueue :: this.name = ${this.name}, this.queue = ${this.queue}`
      );
    }
  }

  async waitTillMyTurn(ticket: Ticket): Promise<void> {
    let count = 0;

    while (this.queue[0] !== ticket) {
      count += 1;
      await sleep(count);
    }
  }

  isAborted(ticket: Ticket): boolean {
    return this.queue.at(-1) !== ticket;
  }
}

class Ticket {
  private number: number;

  constructor() {
    this.number = Math.random();
  }

  public get value(): number {
    return this.number;
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
