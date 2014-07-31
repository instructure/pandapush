/** @jsx React.DOM */

'use strict';

var React        = require('react'),
    Router       = require('react-router'),
    Route        = Router.Route,
    Link         = Router.Link,
    moment       = require('moment'),
    _            = require('lodash'),
    Tab          = require('./tab'),
    Info         = require('./application/info'),
    Keys         = require('./application/keys'),
    Console      = require('./application/console'),
    Faye         = window.Faye;

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

  getToken: function(appId, channel, done) {
    $.ajax({
      type: 'POST',
      url: '/admin/api/application/' + appId + '/token',
      data: JSON.stringify({
        channel: channel,
        pub: true,
        sub: true
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data) {
        done(null, data.token);
      }
    });
  },

  createClient: function() {
    this.client = new Faye.Client('/push');
    this.client.addExtension({
      outgoing: function(message, callback) {
        if (message.channel == '/meta/subscribe') {
          // get a token
          this.getToken(this.props.params.id, message.subscription, function(err, token) {
            if (err) {
              alert('error getting a token: ' + err);
              return;
            }

            if (!message.ext) message.ext = {};
            message.ext.auth = { token: token };
            callback(message);
          });
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

  loadData: function() {
    $.getJSON('/admin/api/applications', function(data) {
      var app = _.find(data, { application_id: this.props.params.id });
      this.setState({ app: app });
    }.bind(this));
  },

  handleStats: function(source, received, stats) {
    this.state.stats[source] = {
      received: received,
      stats: stats
    };

    this.forceUpdate();
  },

  componentDidMount: function() {
    this.loadData();

    if (!this.props.activeRouteHandler()) {
      Router.replaceWith('applicationInfo', this.props.params, this.props.query);
    }

    this.createClient();
    this.client.subscribe('/' + this.props.params.id + '/meta/statistics', function(msg) {
      this.handleStats(msg.data.source, msg.received, msg.data.stats);
    }.bind(this));
  },

  handleReload: function() {
    this.loadData();
  },

  renderClients: function() {
    // only get sources with recent data
    var recent = _.filter(this.state.stats, function(stats) { return stats.received.valueOf() > Date.now() - 10000; });
    var sum = _.reduce(recent, function(sum, s) { return sum + s.stats.clients; }, 0);
    return (
      <span className="pull-right">
        {sum || 0} connected clients
      </span>
    );
  },

  render: function() {
    return (
      <div className="container">
        {this.renderClients()}
        <h1>{this.state.app.name} <span style={{'font-size': '0.6em'}}>(<span className="identifier">{this.props.params.id}</span>)</span></h1>

        <div className="row">
          <ul className="nav nav-tabs" role="tablist">
            <Tab to="applicationInfo" id={this.props.params.id}>Info</Tab>
            <Tab to="applicationKeys" id={this.props.params.id}>Keys</Tab>
            <Tab to="applicationConsole" id={this.props.params.id}>Console</Tab>
          </ul>

          <br />

          {this.props.activeRouteHandler({
            app: this.state.app,
            reload: this.handleReload,
            client: this.client,
            getToken: this.getToken
          })}
        </div>
      </div>
    );
  }
});

