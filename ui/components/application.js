'use strict';

var React        = require('react'),
    Link         = require('react-router').Link,
    moment       = require('moment'),
    _            = require('lodash'),
    Info         = require('./application/info'),
    Keys         = require('./application/keys'),
    Console      = require('./application/console'),
    Pandapush    = require('../../client/dist/client');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      app: {
        application_id: "?",
        keys: {},
        admins: []
      },
      stats: {}
    };
  },

  loadData: function() {
    fetch('/admin/api/applications', { credentials: 'same-origin', })
      .then(response => response.json())
      .then(json => {
        var app = _.find(json, { application_id: this.props.params.id });
        this.setState({ app: app });
      })
      .catch(e => {
        console.log('error getting applications', e);
      });
  },

  handleStats: function(source, received, stats) {
    this.state.stats[source] = {
      received: received,
      stats: stats
    };

    this.forceUpdate();
  },

  getToken: function(appId, channel, presence, done) {
    fetch('/admin/api/application/' + appId + '/token', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        channel: channel,
        presence: presence,
        pub: true,
        sub: true
      })
    }).then(response => response.json())
      .then(json => {
        done(null, json.token)
      })
      .catch(e => {
        console.log('error getting token', e);
      });
  },

  createClient: function() {
    this.client = new Pandapush.Client('/push');
    this.client.addExtension({
      outgoing: function(message, callback) {
        if (message.channel == '/meta/subscribe') {
          if (message.ext && message.ext.auth) {
            callback(message);
            return;
          }

          // get a token (cause we didn't already have one)
          this.getToken(this.props.params.id, message.subscription, null, function(err, token) {
            if (err) {
              alert('error getting a token: ' + err);
              return;
            }

            if (!message.ext) message.ext = {};
            message.ext.auth = { token: token };
            callback(message);
          }.bind(this));
        }
        else {
          callback(message);
        }
      }.bind(this),
      incoming: function(message, callback) {
        if (!message.data) message.data = {};

        // wrap up the message object so metadata gets sent up to
        // our consumer.
        message.data = {
          data: message.data,
          channel: message.channel,
          received: moment()
        }
        callback(message);
      }
    });
  },

  componentDidMount: function() {
    this.loadData();

    this.createClient();
    this.client.subscribe('/' + this.props.params.id + '/meta/statistics', function(msg) {
      this.handleStats(msg.data.source, msg.received, msg.data.stats);
    }.bind(this));
  },

  handleReload: function() {
    this.loadData();
  },

  render: function() {
    return (
      <div className="container">
        <h1>{this.state.app.name} <span style={{ fontSize: '0.6em' }}>(<span className="identifier">{this.props.params.id}</span>)</span></h1>

        <div className="row">
          <ul className="nav nav-tabs" role="tablist">
            <li><Link to={`/application/${this.props.params.id}/info`} activeClassName="active">Info</Link></li>
            <li><Link to={`/application/${this.props.params.id}/keys`} activeClassName="active">Keys</Link></li>
            <li><Link to={`/application/${this.props.params.id}/console`} activeClassName="active">Console</Link></li>
          </ul>

          <br />

          {React.cloneElement(this.props.children, {
            app: this.state.app,
            reload: this.handleReload,
            client: this.client,
            getToken: this.getToken,
            username: this.props.username
          })}
        </div>
      </div>
    );
  }
});
