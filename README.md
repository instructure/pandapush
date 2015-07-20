# Overview

Pandapush is an web pub/sub system similar to [Pusher](http://pusher.com/).

Currently built on [Faye](http://faye.jcoglan.com/) for event routing
and dispatch. (Pandapush adds a layer of multi-tenancy and
authentication.)


## Getting Started

### Using Docker

```bash
$ docker run -ti -p 49000:3000 -v /tmp/pandapush-data:/app/localdata -e ADMIN_USERNAME=admin -e ADMIN_PASSWORD=password zwily/pandapush:latest
```

This will start Pandapush running on your docker host. If that's
localhost, then access the web ui at http://localhost:49000/admin. Log
in with `admin`/`password`.

### From the repository, using docker-compose

```bash
$ docker-compose run --rm web npm install
$ docker-compose run --rm webpack npm install
$ docker-compose up
```

This will start Pandapush on http://pandapush.docker/admin.

(Note - use Chrome instead of Safari when doing local testing. Safari refuses
to override HTTP Basic Auth when making an ajax request.)


### Create an Application and Key:

Create an application, and a key.

Examples below will use these values:

| Name | Value |
| ---- | ----- |
| application name | testapp |
| application id | fRP0y2aVpYCKiW6PIFOK |
| key id | PSIDv4ADyV6V9fQ2BgJZ |
| key secret | aWvMCPXnV599u6hJ71YJqAKSz0t0Lihs09DM92xS |
| key expires | 2020-01-01T07:00:00.000Z |


### Subscribe to a channel in a browser

Use the client library to subscribe to a public channel (see discussion
below about public vs private).

For now we are using the Faye client directly, but in the future would
like to create our own wrapper to hide implementation details like
including the application id in the channel name.

```html
<!-- pull in the client in your html -->
<script src="http://localhost:5000/push/client.js"></script>
```

```javascript
var client = new Faye.Client('http://localhost:5000/push');
client.subscribe('/fRP0y2aVpYCKiW6PIFOK/public/messages', function(message) {
  console.log("got message: ", message);
});

```

### Push an event

Create a token and push an event via HTTP POST.

(We need a library for this for Ruby and Javascript as well.)

```ruby
require 'httparty'

HTTParty.post("http://localhost:5000/channel/fRP0y2aVpYCKiW6PIFOK/public/messages",
  basic_auth: {
    username: 'PSIDv4ADyV6V9fQ2BgJZ',
    password: 'aWvMCPXnV599u6hJ71YJqAKSz0t0Lihs09DM92xS'
  },
  body: {
    # this is your message payload, which can be whatever you want
    foo: "bar"
  })
```

You should see the message arrive in your browser console.


## Channel Names

Channel names must be formatted as absolute path names whose segments
may contains only letters, number, and the symbols -, \_, and ~.

The first segment of the channel must be the applicationId, the second
segment must be "public" or "private", and the remainder is up to you:

`/<applicationId>/<"public" or "private">/whatever/you/want`

For example:

`/fRP0y2aVpYCKiW6PIFOK/private/users/412342/message_count`

The public/private portion designates whether or not a token is needed
to subscribe to that channel. Publishing always requires authentication.

There is another channel type that you'll probably never use: `meta`.
Events are pushed to `meta` channels with monitoring information on the
application (like # of connected clients). You can't push to `meta`
channels.

(In the future we may add more channel types - like `presence`.)

### Wildcards

You can also subscribe to all channels under a path using wildcards. Wildcards can
only appear as the last path component, and must be either `*` or `**`.
A single `*` signals to receive messages for all channels under that
path for a single level, and `**` is recursive.

For example, if you subscribe to the channel `/users/1/**`,
you will receive notifications for `/users/1/foo` and
`/users/1/foo/bar`. If you subscribe to `/users/1/*` you will receive
pushes for `/users/1/foo` but not `/users/1/foo/bar`.

|  | sub `/users/1/*` | sub `/users/1/**` |
| ------------- | ----------- | ------------- |
| push `/users/1` | not received | not received |
| push `/users/1/foo` | received | received |
| push `/users/1/foo/bar` | not received | received |


## Authentication

Authentication is done either by supplying a key and secret or a token
signed with a key. The key/secret method can be used for server-side
pushes. Normally you will generate tokens to give to clients in
browsers. (You never want to give your key secret to a browser, as it
should be kept... secret.)

Tokens are scoped to publishing/subscribing to a specific channel. You
only need a token to subscribe to `/private/` channels. Generally, you
will be using private channels. You should generate the tokens server
side, because they require using the token secret to sign.

Tokens are [JWTs](http://www.intridea.com/blog/2013/11/7/json-web-token-the-useful-little-standard-you-haven-t-heard-about).
You should use a library to generate them. The payload has the contents:

| Field   | Required? | Description |
| ------- | --------- | ----------- |
| keyId   | required  | The id of the key used for signing the token. |
| channel | required  | The channel name the token works for. Must start with `/<app>/private/` or `/<app>/public/`. |
| pub     | optional  | `true` if this token allows publishing. |
| sub     | optional  | `true` if this token allows subscribing. Note that `sub` on a public channel is redundant. |
| exp     | optional  | Unix timestamp of when the token should expire. |

[jwt.io](http://jwt.io) is useful when debugging JSON web tokens.

Ruby example:

```ruby
require 'jwt'

token = JWT.encode({
  keyId: "PSIDv4ADyV6V9fQ2BgJZ",
  channel: "/fRP0y2aVpYCKiW6PIFOK/public/messages",
  pub: true
}, "aWvMCPXnV599u6hJ71YJqAKSz0t0Lihs09DM92xS")
```

### Wildcard Authentication

You can specify a wildcard channel name for subscription, but the client
must subscribe exactly to the channel name specified. For example, if
you specify as channel `/<app>/private/users/1/**`, the client must
subscribe to `/<app>/private/users/1/**`, **not**
`/<app>/private/users/1/messages`.


## Publishing REST API

If using a key/secret for auth:

```bash
$ curl -u <keyId>:<keySecret> -H "Content-Type: application/json" -d '{text:"hello"}' https://pp.instructure.com/channel/<app>/private/users/123/messages
```

Using a token for auth:

```bash
$ curl -H "Authorization: Token <token>" -H "Content-Type: application/json" -d '{text:"hello"}' https://pp.instructure.com/channel/<app>/private/users/123/messages
```


## Subscribing to a Private channel

To subscribe to a `/private/` channel, you must provide a token. You can
either supply this on your page at render time, or have the browser ask
your server for one. Make sure to verify that the user requesting
the token has permissions to view the associated resources.

Here's how to add the token to your subscription request with the Faye
client.

```javascript
client.addExtension({
  outgoing: function(message, callback) {
    if (message.channel !== '/meta/subscribe')
      return callback(message);

    // The channel being subscribed to is stored in `message.subscription`
    // if you need to inspect it.

    message.ext = message.ext || {};
    message.ext.auth = { token: TOKEN_FROM_SERVER };
    callback(message);
  }
});
```

(Read more about this pattern in the [Faye documentation](http://faye.jcoglan.com/security/authentication.html).)


# Mobile

Note that this is *not* a "Push Notification" service like for iOS and
Android. There do appear to be some open-source Faye clients
for iOS and Android, but I have not tested any of them yet.
