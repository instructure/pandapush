declare module "faye" {
  interface Subscription {
    then(resolve: () => void, reject: (error: Error) => void): void;
    cancel(): void;
  }

  interface Extension {
    outgoing?(message: Record<string, unknown>, callback: (message: Record<string, unknown>) => void): void;
    incoming?(message: Record<string, unknown>, callback: (message: Record<string, unknown>) => void): void;
  }

  class Client {
    constructor(url: string);
    subscribe(channel: string, callback: (message: unknown) => void): Subscription;
    addExtension(extension: Extension): void;
    disconnect(): void;
  }
}
