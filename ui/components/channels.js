/** @jsx React.DOM */

'use strict';

var React         = require('react'),
    Router        = require('react-nested-router'),
    Route         = Router.Route,
    Link          = Router.Link,
    moment        = require('moment'),
    _             = require('lodash'),
    Faye          = window.Faye,
    $             = window.jQuery,
    ChannelPicker = require('./channel_picker');

var getToken = function(app, channel, done) {
  var key = _.find(_.values(app.keys), function(key) {
    return !moment(key.expires).isBefore(moment()) && !key.revoked_at;
  });

  if (!key) {
    done("could not find a valid key");
    return;
  }

  $.ajax({
    type: 'POST',
    url: '/admin/api/application/' + app.application_id + '/keys/' + key.key_id + '/token',
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
};

module.exports = React.createClass({
  getInitialState: function() {
    return {
      subChannel: null,
      events: []
    };
  },

  loadData: function() {
    $.getJSON('/admin/api/applications', function(data) {
      var app = _.find(data, { application_id: this.props.params.id });
      this.setState({ app: app });
    }.bind(this));
  },

  componentDidMount: function() {
    console.log("didmount");
    this.loadData();

    var getCurrentToken = function() {
      return this.subToken;
    }.bind(this);

    this.client = new Faye.Client('/push');
    this.client.addExtension({
      outgoing: function(message, callback) {
        if (!message.ext) message.ext = {};
        message.ext.auth = { token: getCurrentToken() };
        callback(message);
      },
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

  handlePublish: function(e) {
    e.preventDefault();

    var channel = this.refs["pubChannel"].get(),
        payload = this.refs["pubPayload"].getDOMNode().value;

    try {
      payload = JSON.parse(payload);
    }
    catch(e) {
      alert('Payload must be valid JSON.\n\n' + e.message);
      return;
    }

    getToken(this.state.app, channel, function(err, token) {
      if (err) {
        alert("error getting token.\n\n" + err);
        return;
      }

      $.ajax({
        type: 'POST',
        url: '/channel' + channel,
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Token ' + token);
        },
        success: function(data) {
          console.log('data published', data);
        }
      });
    });

    console.log("publishing to " + channel, payload);
  },

  handleSubscribe: function(e) {
    e.preventDefault();

    var channel = this.refs["subChannel"].get();

    var doSubscribe = function() {
      console.log("subscribing to " + channel);

      getToken(this.state.app, channel, function(err, token) {
        if (err) {
          alert("error getting token.\n\n" + err);
          return;
        }

        this.subToken = token;

        this.client.subscribe(channel, function(message) {
          this.state.events.splice(0, 0, message);
          this.state.events = this.state.events.splice(0, 50);
          this.forceUpdate();

          if (this.state.events.length >= 50) {
            this.client.unsubscribe(this.state.subChannel);
            this.setState({
              subscribed: false
            });
          }
        }.bind(this));

        this.setState({
          subChannel: channel,
          subscribed: true,
          events: []
        });
      }.bind(this));
    }.bind(this);

    if (this.state.subChannel) {
      this.client.unsubscribe(this.state.subChannel);
      doSubscribe();
    }
    else {
      doSubscribe();
    }

  },

  updateChannelParams: function(channel) {
    return function(newParams) {
      var params = this.props.query;
      params[channel + 'Type'] = newParams.channelType;
      params[channel + 'Path'] = newParams.path;

      Router.replaceWith('channels', { id: this.props.params.id }, params);
    }.bind(this);
  },

  handlePayloadChange: function(e) {
    var params = this.props.query;
    var payload = this.refs["pubPayload"].getDOMNode().value;
    if (payload.length > 1024) {
      params.payload = '';
    }
    else {
      params.payload = payload;
    }
    Router.replaceWith('channels', { id: this.props.params.id }, params);
  },

  renderEventsTable: function() {
    if (this.state.events.length == 0) {
      return "Nothing yet.";
    }

    var ary = this.state.subChannel.split('*', 2);
    var prefix = null;
    if (ary.length > 1) {
      prefix = ary[0];
    }

    var events = _.map(this.state.events, function(ev) {
      var shortenedChannel = ev.channel.replace(prefix, "");
      var channelTd = null;
      if (prefix) {
        channelTd = <td>{shortenedChannel}</td>;
      }

      return (
        <tr>
          {channelTd}
          <td>{ev.received.toISOString()}</td>
          <td><pre>{JSON.stringify(ev.data, null, 2)}</pre></td>
        </tr>
      );
    });

    var channelTh = null;
    if (prefix) {
      channelTh = <th>Channel</th>
    }

    return (
      <table className="table">
        <tbody>
          <tr>
            {channelTh}
            <th>Received</th>
            <th>Payload</th>
          </tr>

          {events}
        </tbody>
      </table>
    );
  },

  renderEvents: function() {
    if (!this.state.subChannel) {
      return null;
    }

    var subscribedImg = null;
    if (this.state.subscribed) {
      subscribedImg = <img src="/loader.gif" />;
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="pull-right">
            {this.state.events.length} events
          </div>

          <h4>{subscribedImg} {this.state.subChannel}</h4>
        </div>

        <div className="panel-body">
          {this.renderEventsTable()}
        </div>
      </div>
    );
  },

  render: function() {
    return (
      <div className="container">
        <div className="row">
          <form onSubmit={this.handlePublish} className="form-horizontal" role="form">
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="postChannel">Publish to</label>
              <div className="col-sm-6">
                <ChannelPicker
                  ref="pubChannel"
                  applicationId={this.props.params.id}
                  visibility={this.props.query.pubChannelType || "public"}
                  path={this.props.query.pubChannelPath || ""}
                  updateParams={this.updateChannelParams('pubChannel')} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Payload</label>
              <div className="col-sm-4">
                <textarea onChange={this.handlePayloadChange} ref="pubPayload" className="form-control" rows="3" value={this.props.query.payload} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label"></label>
              <div className="col-sm-4">
                <button type="submit" className="btn btn-default">Publish</button>
              </div>
            </div>
          </form>
        </div>

        <div className="row">
          <hr />
        </div>

        <div className="row">
          <form onSubmit={this.handleSubscribe} className="form-horizontal" role="form">
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="postChannel">Subscribe to</label>
              <div className="col-sm-6">
                <ChannelPicker
                  ref="subChannel"
                  applicationId={this.props.params.id}
                  visibility={this.props.query.subChannelType || "public"}
                  path={this.props.query.subChannelPath || ""}
                  updateParams={this.updateChannelParams('subChannel')} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label"></label>
              <div className="col-sm-4">
                <button type="submit" className="btn btn-default">Subscribe</button> (for 50 events)
              </div>
            </div>
          </form>

          {this.renderEvents()}
        </div>
      </div>
    );
  }
});
