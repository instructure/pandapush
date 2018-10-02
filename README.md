# Overview

Pandapush is an web pub/sub system similar to [Pusher](http://pusher.com/).

Currently built on [Faye](http://faye.jcoglan.com/) for event routing
and dispatch. (Pandapush adds a layer of multi-tenancy and
authentication.)

## Getting Started

### Using the standalong Docker image

```bash
$ docker run -ti -p 3000:80 -e AUTH_METHOD=basic -e ADMIN_USERNAME=admin -e ADMIN_PASSWORD=password instructure/pandapush:latest
```

This will start Pandapush running on your docker host. If that's
localhost, then access the web ui at http://localhost:49000/admin. Log
in with `admin`/`password`.

### From the repository, using docker-compose

```bash
$ docker-compose run --rm -u root web chown docker:docker node_modules
$ docker-compose run --rm web npm install
$ docker-compose run --rm webpack npm install
$ docker-compose up
```

This will start Pandapush on http://pandapush.docker/admin.

### Create an Application and Key:

Create an application, and a key.

Examples below will use these values:

| Name             | Value                                    |
| ---------------- | ---------------------------------------- |
| application name | testapp                                  |
| application id   | fRP0y2aVpYCKiW6PIFOK                     |
| key id           | PSIDv4ADyV6V9fQ2BgJZ                     |
| key secret       | aWvMCPXnV599u6hJ71YJqAKSz0t0Lihs09DM92xS |
| key expires      | 2020-01-01T07:00:00.000Z                 |

### Subscribe to a channel in a browser

Use the client library to subscribe to a public channel (see discussion
below about public vs private).

```html
<!-- pull in the client in your html -->
<script src="http://localhost:5000/client.js"></script>
```

```javascript
var client = new Pandapush.Client("http://localhost:5000/push");
client.subscribe("/fRP0y2aVpYCKiW6PIFOK/public/messages", function(message) {
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

### Wildcards

You can also subscribe to all channels under a path using wildcards. Wildcards can
only appear as the last path component, and must be either `*` or `**`.
A single `*` signals to receive messages for all channels under that
path for a single level, and `**` is recursive.

For example, if you subscribe to the channel `/users/1/**`,
you will receive notifications for `/users/1/foo` and
`/users/1/foo/bar`. If you subscribe to `/users/1/*` you will receive
pushes for `/users/1/foo` but not `/users/1/foo/bar`.

|                         | sub `/users/1/*` | sub `/users/1/**` |
| ----------------------- | ---------------- | ----------------- |
| push `/users/1`         | not received     | not received      |
| push `/users/1/foo`     | received         | received          |
| push `/users/1/foo/bar` | not received     | received          |

## Authentication

Authentication is done either by supplying a key and secret or a token
signed with a key. The key/secret method can be used for server-side
pushes. Normally you will generate tokens to give to clients in
browsers. (You never want to give your key secret to a browser, as it
should be kept... secret.)

Tokens are scoped to publishing/subscribing to a specific channel. You
need a token to subscribe to `/private/` and `/presence/` channels. Generally, you
will be using private channels. You should generate the tokens server
side, because they require using the token secret to sign.

Tokens are [JWTs](http://www.intridea.com/blog/2013/11/7/json-web-token-the-useful-little-standard-you-haven-t-heard-about).
You should use a library to generate them. The payload has the contents:

| Field    | Required? | Description                                                                                  |
| -------- | --------- | -------------------------------------------------------------------------------------------- |
| keyId    | required  | The id of the key used for signing the token.                                                |
| channel  | required  | The channel name the token works for. Must start with `/<app>/private/` or `/<app>/public/`. |
| pub      | optional  | `true` if this token allows publishing.                                                      |
| sub      | optional  | `true` if this token allows subscribing. Note that `sub` on a public channel is redundant.   |
| presence | optional  | An object identifying the user for presence channels.                                        |
| exp      | optional  | Unix timestamp of when the token should expire.                                              |

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

## Publishing REST API

If using a key/secret for auth:

```bash
$ curl -u <keyId>:<keySecret> -H "Content-Type: application/json" -d '{text:"hello"}' https://pp.instructure.com/channel/<app>/private/users/123/messages
```

Using a token for auth:

```bash
$ curl -H "Authorization: Token <token>" -H "Content-Type: application/json" -d '{text:"hello"}' https://pp.instructure.com/channel/<app>/private/users/123/messages
```

## Subscribing with the Pandapush client

To subscribe to private channels, you must specify authentication information.
This is easiest to do by using the Pandapush client:

```html
<script src="https://pandapush.hostname/client.js"></script>
```

```javascript
const CHANNEL = "/applicationid/private/foo"; // sent by server
const TOKEN = "..."; // sent by server
client = new Pandapush.Client("https://pandapush.hostname/push");
client.subscribeTo(CHANNEL, TOKEN, function(message) {
  console.log("got message!");
});
```

The Pandapush client is also a Faye client, and supports all the
method described in the [Faye documentation](http://faye.jcoglan.com/security/authentication.html).

## Presence

Presence is a feature you can use to signal to a group of subscribers
to a channel who else is subscribed to that channel. Presence channels
begin with `/presence/`, and when a user subscribes to a presence
channel, they must have a `presence` object in their token that has
at least an `id` field. For example, the token may be an encoded JWT of:

```json
{
  "keyId": "PSIDv4ADyV6V9fQ2BgJZ",
  "channel": "/fRP0y2aVpYCKiW6PIFOK/presence/generaltalk",
  "sub": true,
  "presence": {
    "id": "user1",
    "name": "Joe",
    "avatar_url": "https://gravatar/foo"
  }
}
```

When the client subscribes to the channel `/fRP0y2aVpYCKiW6PIFOK/presence/generaltalk`
using the given token, all other subscribers to that channel will receive a
notification:

```json
{
  "subscribe": {
    "user1": {
      "id": "user1",
      "name": "Joe",
      "avatar_url": "https://gravatar/foo"
    }
  }
}
```

"Joe" will also receive a callback similar to the one above, but with all
users currently subscribed to that channel.

When Joe disconnects, all other users will receive a message:

```json
{
  "unsubscribe": {
    "user1": null
  }
}
```

Presence data should be kept small, as it is persisted in redis in memory.

# Running in Production

The standalone docker image uses an embedded redis process and sqlite for storing
application metadata, but you don't want that in production.

## Redis hosts

You can specify one or more redis hosts with the `REDIS_HOSTS` environment variable.
Pass `hostname:port` pairs, separated by commas.

## Database (postgres)

You can specify a postgres database to use with the following environment vars:

```
DATABASE=postgres
DATABASE_ADDRESS=<host or ip>
DATABASE_PORT=<port>
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
DATABASE_NAME=pandapush
```

Initialize the database (and apply further migrations) with the following command run
inside one of your pandapush containers:

```
knex --knexfile server/knexfile.js migrate:latest
```

# Mobile

Note that this is _not_ a "Push Notification" service like for iOS and
Android. There do appear to be some open-source Faye clients
for iOS and Android, but I have not tested any of them.
