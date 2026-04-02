import Faye from "faye";

interface SubscribeOptions {
  fayeUrl: string;
  channel: string;
  token?: string;
  timeoutMs?: number;
  onSubscribed?: () => void | Promise<void>;
}

export function subscribeAndWaitForMessage(
  options: SubscribeOptions,
): Promise<unknown> {
  const { fayeUrl, channel, token, timeoutMs = 10_000, onSubscribed } = options;
  const client = new Faye.Client(fayeUrl);

  if (token) {
    client.addExtension({
      outgoing(message, callback) {
        if (message.channel === "/meta/subscribe") {
          message.ext = { ...(message.ext as object), auth: { token } };
        }
        callback(message);
      },
    });
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      client.disconnect();
      reject(new Error(`no message received within ${timeoutMs}ms`));
    }, timeoutMs);

    const subscription = client.subscribe(channel, (message: unknown) => {
      clearTimeout(timer);
      client.disconnect();
      resolve(message);
    });

    subscription.then(
      async () => {
        try {
          await onSubscribed?.();
        } catch (e) {
          clearTimeout(timer);
          client.disconnect();
          reject(e);
        }
      },
      (error: Error) => {
        clearTimeout(timer);
        client.disconnect();
        reject(error);
      },
    );
  });
}

export function expectSubscriptionRejected(
  options: Omit<SubscribeOptions, "timeoutMs"> & { timeoutMs?: number },
): Promise<Error> {
  const { fayeUrl, channel, token, timeoutMs = 10_000 } = options;
  const client = new Faye.Client(fayeUrl);

  if (token) {
    client.addExtension({
      outgoing(message, callback) {
        if (message.channel === "/meta/subscribe") {
          message.ext = { ...(message.ext as object), auth: { token } };
        }
        callback(message);
      },
    });
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      client.disconnect();
      reject(new Error(`subscription did not fail within ${timeoutMs}ms`));
    }, timeoutMs);

    const subscription = client.subscribe(channel, () => {
      clearTimeout(timer);
      client.disconnect();
      reject(new Error("subscription should have been rejected but received a message"));
    });

    subscription.then(
      () => {
        clearTimeout(timer);
        client.disconnect();
        reject(new Error("subscription should have been rejected but succeeded"));
      },
      (error: Error) => {
        clearTimeout(timer);
        client.disconnect();
        resolve(error);
      },
    );
  });
}
