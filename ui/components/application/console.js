import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChannelPicker from '../channel_picker';

class Console extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subChannel: null,
      presence: this.props.location.params && this.props.location.params.subChannelType === 'presence',
      events: [],
      subscribers: {}
    };
  }

  loadData() {
    fetch('/admin/api/applications', { credentials: 'same-origin', })
      .then(response => response.json())
      .then(json => {
        var app = _.find(json, { application_id: this.props.params.id });
        this.setState({ app: app });
      })
      .catch(e => {
        console.log('error getting applications', e);
      });
  }

  componentDidMount() {
    this.loadData();
  }

  handlePublish = (e) => {
    e.preventDefault();

    const channel = this.pubChannel.get();
    let payload = this.pubPayloadInput.value;

    try {
      payload = JSON.parse(payload);
    }
    catch(e) {
      alert('Payload must be valid JSON.\n\n' + e.message);
      return;
    }

    this.props.getToken(this.props.app.application_id, channel, null, (err, token) => {
      if (err) {
        alert("error getting token.\n\n" + err);
        return;
      }

      fetch('/channel' + channel + '?token=' + token, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (response.ok) {
          this.setState({
            publishStatus: true
          });
        } else {
          response.json().then(json => {
            this.setState({
              publishStatus: {
                status: response.status,
                statusText: response.statusText,
                body: json.message
              }
            });
          });
        }
      })
    });
  }

  handleSubscribe = (e) => {
    e.preventDefault();

    const channel = this.subChannel.get();

    var doSubscribe = function() {
      const presence = (channel.split('/')[2] === 'presence');
      let presenceId, presenceData = null;

      if (presence) {
        const presenceId = this.presenceIdInput.value || this.props.username;
        presenceData = {};
        const rawPresenceData = this.presenceDataInput.value;
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

        this.props.client.subscribe(channel, token, presenceData, function(message, channel) {
          const event = {
            data: message,
            channel: channel,
            received: moment()
          };

          this.state.events.splice(0, 0, event);
          this.state.events = this.state.events.splice(0, 50);
          this.forceUpdate();

          if (this.state.events.length >= 50) {
            this.props.client.unsubscribe(this.state.subChannel);
            this.setState({
              subscribed: false
            });
          }

          if (presence) {
            const subscribers = this.state.subscribers || {};

            const updatedSubscribers =
              _({})
                .extend(subscribers, message.subscribe || {})
                .omit(_.keys(message.unsubscribe))
                .value();

            this.setState({
              subscribers: updatedSubscribers
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
  }

  updateChannelParams = (channel) => {
    return function(newParams) {
      var params = this.props.location.query;
      params[channel + 'Type'] = newParams.channelType;
      params[channel + 'Path'] = newParams.path;

      this.context.router.replace({
        pathname: this.props.location.pathname,
        query: params
      });

      this.setState({
        presenceSub: (newParams.channelType === 'presence')
      });
    }.bind(this);
  }

  handleFieldChange = (field, e) => {
    var params = this.props.location.query;
    var value = this[field].value;
    if (value.length > 1024) {
      params[field] = '';
    }
    else {
      params[field] = value;
    }

    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: params
    });
  }

  renderEventsTable() {
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

    events = _.map(events, function(ev, index) {
      var shortenedChannel = ev.channel.replace(prefix, "");
      var channelTd = null;
      if (prefix) {
        channelTd = <td>{shortenedChannel}</td>;
      }

      return (
        <tr key={`${ev.channel}-${ev.received && ev.received.toISOString()}`}>
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
  }

  renderEvents() {
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
  }

  renderSubscribers() {
    if (!(this.props.location.query.subChannelType === 'presence' && this.state.subChannel)) {
      return <span />;
    }

    var r = _.map(this.state.subscribers, function(data, id) {
      return <span key={id} className="label label-primary subscriber">{id}</span>;
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
  }

  renderPresenceFields() {
    if (this.props.location.query.subChannelType === 'presence') {
      return (
        <div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Presence ID</label>
            <div className="col-sm-4">
              <input type="text" onChange={this.handleFieldChange.bind(this, 'presenceIdInput')} ref={e => this.presenceIdInput = e} className="form-control" placeholder={this.props.username} defaultValue={this.props.location.query.presenceIdInput} />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Presence Data</label>
            <div className="col-sm-4">
              <textarea onChange={this.handleFieldChange.bind(this, 'presenceDataInput')} ref={e => this.presenceDataInput = e} className="form-control" rows="3" defaultValue={this.props.location.query.presenceDataInput} />
            </div>
          </div>
        </div>
      );
    }

    return <span />;
  }

  renderPublishStatus() {
    if (this.state.publishStatus === true) {
      return <span style={{paddingLeft: '10px'}} className="text-success">Sent.</span>;
    }

    if (this.state.publishStatus) {
      return (
        <span style={{paddingLeft: '10px'}}>
          <span className="text-danger">{this.state.publishStatus.statusText}</span>&nbsp;
          <span className="text-warning">[{this.state.publishStatus.status}]</span>&nbsp;
          <span className="text-muted">{this.state.publishStatus.body}</span>
        </span>
      );
    }

    return;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <form onSubmit={this.handlePublish} className="form-horizontal" role="form">
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="postChannel">Publish to</label>
              <div className="col-sm-6">
                <ChannelPicker
                  ref={e => this.pubChannel = e}
                  applicationId={this.props.params.id}
                  type={this.props.location.query.pubChannelType || "public"}
                  path={this.props.location.query.pubChannelPath || ""}
                  updateParams={this.updateChannelParams('pubChannel')} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Payload</label>
              <div className="col-sm-4">
                <textarea onChange={this.handleFieldChange.bind(this, 'pubPayloadInput')} ref={e => this.pubPayloadInput = e} className="form-control" rows="3" defaultValue={this.props.location.query.pubPayload} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label"></label>
              <div className="col-sm-4">
                <button type="submit" className="btn btn-default">Publish</button>
                {this.renderPublishStatus()}
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
                  ref={e => this.subChannel = e}
                  applicationId={this.props.params.id}
                  type={this.props.location.query.subChannelType || "public"}
                  path={this.props.location.query.subChannelPath || ""}
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
}

Console.contextTypes = {
  router: React.PropTypes.object.isRequired
};

module.exports = Console;