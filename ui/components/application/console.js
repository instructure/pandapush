/** @jsx React.DOM */

'use strict';

var React         = require('react'),
    Router        = require('react-router'),
    Route         = Router.Route,
    Link          = Router.Link,
    moment        = require('moment'),
    _             = require('lodash'),
    $             = window.jQuery,
    ChannelPicker = require('../channel_picker');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      subChannel: null,
      presence: this.props.params.subChannelType === 'presence',
      events: [],
      subscribers: {}
    };
  },

  loadData: function() {
    $.getJSON('/admin/api/applications', function(data) {
      var app = _.find(data, { application_id: this.props.params.id });
      this.setState({ app: app });
    }.bind(this));
  },

  componentDidMount: function() {
    this.loadData();
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

    this.props.getToken(this.props.app.application_id, channel, null, function(err, token) {
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
        }
      });
    });
  },

  handleSubscribe: function(e) {
    e.preventDefault();

    var channel = this.refs["subChannel"].get();

    var doSubscribe = function() {
      var presence = (channel.split('/')[2] === 'presence');
      var presenceId, presenceData = null;

      if (presence) {
        var presenceId = this.refs["presenceId"].getDOMNode().value || this.props.username;
        var presenceData = {};
        var rawPresenceData = this.refs["presenceData"].getDOMNode().value;
        if (rawPresenceData) {
          try {
            presenceData = JSON.parse(rawPresenceData);
          } catch(e) {
            alert('Presence Data must be valid JSON.\n\n' + e.message);
            return;
          }
        }
        presenceData.id = presenceId;
      }

      this.props.getToken(this.props.app.application_id, channel, presenceData, function(err, token) {
        if (err) {
          alert('Error getting token', err);
          return;
        }

        this.props.client.subscribe(channel, token, presenceData, function(message) {
          if (message.channel) {
            this.state.events.splice(0, 0, message);
            this.state.events = this.state.events.splice(0, 50);
            this.forceUpdate();
          }

          if (this.state.events.length >= 50) {
            this.props.client.unsubscribe(this.state.subChannel);
            this.setState({
              subscribed: false
            });
          }

          if (presence) {
            var subscribers = this.state.subscribers || {};

            // this funkiness is just because we munge incoming messages to store
            // some metadata alongside them.
            if (message.data) {
              message = message.data;
            }

            subscribers = _.extend({}, subscribers, message.subscribe || {});
            subscribers = _.omit(subscribers, _.keys(message.unsubscribe));
            this.setState({
              subscribers: subscribers
            });
          }
        }.bind(this));
      }.bind(this));

      this.setState({
        subChannel: channel,
        subscribed: true,
        subscribers: {},
        events: []
      });
    }.bind(this);

    if (this.state.subChannel) {
      this.props.client.unsubscribe(this.state.subChannel);
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

      Router.replaceWith('applicationConsole', { id: this.props.params.id }, params);

      this.setState({
        presenceSub: (newParams.channelType === 'presence')
      });
    }.bind(this);
  },

  handleFieldChange: function(field, e) {
    var params = this.props.query;
    var value = this.refs[field].getDOMNode().value;
    if (value.length > 1024) {
      params[field] = '';
    }
    else {
      params[field] = value;
    }
    Router.replaceWith('applicationConsole', { id: this.props.params.id }, params);
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

    var events = _.omit(this.state.events, function(ev) {
      return !ev.channel;
    });

    events = _.map(events, function(ev) {
      var shortenedChannel = ev.channel.replace(prefix, "");
      var channelTd = null;
      if (prefix) {
        channelTd = <td>{shortenedChannel}</td>;
      }

      return (
        <tr>
          {channelTd}
          <td>{ev.received && ev.received.toISOString()}</td>
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

  renderSubscribers: function() {
    if (!(this.props.query.subChannelType === 'presence' && this.state.subChannel)) {
      return <span />;
    }

    var r = _.map(this.state.subscribers, function(data, id) {
      return <span className="label label-primary subscriber">{id}</span>;
    });

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4>Subscribers</h4>
        </div>
        <div className="panel-body">
          {r}
        </div>
      </div>
    );
  },

  renderPresenceFields: function() {
    if (this.props.query.subChannelType === 'presence') {
      return (
        <div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Presence ID</label>
            <div className="col-sm-4">
              <input type="text" onChange={this.handleFieldChange.bind(this, 'presenceId')} ref="presenceId" className="form-control" placeholder={this.props.username} defaultValue={this.props.query.presenceId} />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Presence Data</label>
            <div className="col-sm-4">
              <textarea onChange={this.handleFieldChange.bind(this, 'presenceData')} ref="presenceData" className="form-control" rows="3" defaultValue={this.props.query.presenceData} />
            </div>
          </div>
        </div>
      );
    }

    return <span />;
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
                  type={this.props.query.pubChannelType || "public"}
                  path={this.props.query.pubChannelPath || ""}
                  updateParams={this.updateChannelParams('pubChannel')} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Payload</label>
              <div className="col-sm-4">
                <textarea onChange={this.handleFieldChange.bind(this, 'pubPayload')} ref="pubPayload" className="form-control" rows="3" defaultValue={this.props.query.pubPayload} />
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
                  type={this.props.query.subChannelType || "public"}
                  path={this.props.query.subChannelPath || ""}
                  updateParams={this.updateChannelParams('subChannel')}
                  showPresence='1'
                  showMeta='1' />
              </div>
            </div>

            {this.renderPresenceFields()}

            <div className="form-group">
              <label className="col-sm-2 control-label"></label>
              <div className="col-sm-4">
                <button type="submit" className="btn btn-default">Subscribe</button> (for 50 events)
              </div>
            </div>
          </form>

          {this.renderSubscribers()}
          {this.renderEvents()}
        </div>
      </div>
    );
  }
});
