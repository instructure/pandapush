import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ChannelPicker from '../channel_picker';

class Console extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      subChannel: null,
      presence: this.props.location.params && this.props.location.params.subChannelType === 'presence',
      events: [],
      subscribers: {}
    };
  }

  handlePublish = (useClient, e) => {
    e.preventDefault();

    const channel = this.pubChannel.get();
    let payload = this.pubPayloadInput.value;
    if (payload === '') {
      payload = '{}';
    }

    try {
      payload = JSON.parse(payload);
    } catch (e) {
      alert('Payload must be valid JSON.\n\n' + e.message);
      return;
    }

    this.props.getToken(this.props.app.id, channel, null, (err, token) => {
      window.pp = this.props.client;

      if (err) {
        alert('error getting token.\n\n' + err);
        return;
      }

      if (useClient) {
        this.props.client.publishTo(channel, token, payload)
          .then(() => {
            this.setState({ publishStatus: true });
          }, (err) => {
            this.setState({ publishStatus: {
              body: JSON.stringify(err)
            }});
          });
      } else {
        fetch('/channel' + channel + '?token=' + token, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
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
        });
      }
    });
  }

  handleUnsubscribe = (e) => {
    e.preventDefault();

    this.currentSubscription.cancel();
    this.currentSubscription = null;

    this.setState({
      subscribed: false
    });
  }

  handleSubscribe = (e) => {
    e.preventDefault();

    const channel = this.subChannel.get();

    const presence = (channel.split('/')[2] === 'presence');
    let presenceData = null;

    if (presence) {
      const presenceId = this.presenceIdInput.value || this.props.username;
      presenceData = {};
      const rawPresenceData = this.presenceDataInput.value || '{}';
      if (rawPresenceData) {
        try {
          presenceData = JSON.parse(rawPresenceData);
        } catch (e) {
          alert('Presence Data must be valid JSON.\n\n' + e.message);
          return;
        }
      }
      presenceData.id = presenceId;
    }

    this.props.getToken(this.props.app.id, channel, presenceData, (err, token) => {
      if (err) {
        alert('Error getting token', err);
        return;
      }

      this.currentSubscription = this.props.client.subscribeTo(channel, token, (message, channel) => {
        const event = {
          data: message,
          channel: channel,
          received: moment()
        };

        this.state.events.splice(0, 0, event);
        this.state.events = this.state.events.splice(0, 50);
        this.forceUpdate();

        if (this.state.events.length >= 50) {
          if (this.currentSubscription) {
            this.currentSubscription.cancel();
            this.currentSubscription = null;
          }

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
      });

      this.currentSubscription.then(() => {
        this.setState({ subscribing: false });
      });
    });

    this.setState({
      subChannel: channel,
      subscribed: true,
      subscribing: true,
      subscribers: {},
      events: []
    });
  }

  updateChannelParams = (channel, newParams) => {
    const params = this.props.location.query;
    params[channel + 'Type'] = newParams.channelType;
    params[channel + 'Path'] = newParams.path;

    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: params
    });

    this.setState({
      presenceSub: (newParams.channelType === 'presence')
    });
  }

  handleFieldChange = (field, e) => {
    const params = this.props.location.query;
    const value = this[field].value;
    if (value.length > 1024) {
      params[field] = '';
    } else {
      params[field] = value;
    }

    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: params
    });
  }

  renderEventsTable () {
    if (this.state.events.length === 0) {
      return 'Nothing yet.';
    }

    const ary = this.state.subChannel.split('*', 2);
    let prefix = null;
    if (ary.length > 1) {
      prefix = ary[0];
    }

    const events = _(this.state.events)
      .omit(ev => !ev.channel)
      .map((ev, index) => {
        const shortenedChannel = ev.channel.replace(prefix, '');
        let channelTd = null;
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
      })
      .value();

    const channelTh = prefix ? <th>Channel</th> : null;

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

  renderEvents () {
    if (!this.state.subChannel) {
      return null;
    }

    let subscribedImg = null;
    if (this.state.subscribed) {
      subscribedImg = <img src='/loader.gif' />;
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

  renderSubscribers () {
    if (!(this.props.location.query.subChannelType === 'presence' && this.state.subChannel)) {
      return <span />;
    }

    const r = _.map(this.state.subscribers, (data, id) => {
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

  renderPresenceFields () {
    if (this.props.location.query.subChannelType === 'presence') {
      return (
        <div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Presence ID</label>
            <div className="col-sm-4">
              <input type="text" onChange={this.handleFieldChange.bind(this, 'presenceIdInput')} ref={e => (this.presenceIdInput = e)} className="form-control" placeholder={this.props.username} defaultValue={this.props.location.query.presenceIdInput} />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Presence Data</label>
            <div className="col-sm-4">
              <textarea onChange={this.handleFieldChange.bind(this, 'presenceDataInput')} ref={e => (this.presenceDataInput = e)} className="form-control" rows="3" defaultValue={this.props.location.query.presenceDataInput} />
            </div>
          </div>
        </div>
      );
    }

    return <span />;
  }

  renderPublishStatus () {
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
  }

  channelButtonDisabled (path) {
    return (typeof path === 'undefined' || path === '' || path.slice(-1) === '/');
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <form onSubmit={this.handlePublish} className="form-horizontal" role="form">
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="postChannel">Publish to</label>
              <div className="col-sm-6">
                <ChannelPicker
                  ref={e => (this.pubChannel = e)}
                  applicationId={this.props.params.id}
                  type={this.props.location.query.pubChannelType || 'public'}
                  path={this.props.location.query.pubChannelPath || ''}
                  updateParams={this.updateChannelParams.bind(this, 'pubChannel')} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Payload</label>
              <div className="col-sm-4">
                <textarea onChange={this.handleFieldChange.bind(this, 'pubPayloadInput')} ref={e => (this.pubPayloadInput = e)} className="form-control" rows="3" defaultValue={this.props.location.query.pubPayload} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label"></label>
              <div className="col-sm-4">
                <button
                  type="submit"
                  onClick={this.handlePublish.bind(this, true)}
                  disabled={this.channelButtonDisabled(this.props.location.query.pubChannelPath)}
                  className="btn btn-default">Publish (client)</button>
                <button
                  type="submit"
                  onClick={this.handlePublish.bind(this, false)}
                  disabled={this.channelButtonDisabled(this.props.location.query.pubChannelPath)}
                  className="btn btn-default">Publish (REST)</button>
                {this.renderPublishStatus()}
              </div>
            </div>
          </form>
        </div>

        <div className="row">
          <hr />
        </div>

        <div className="row">
          <form className="form-horizontal" role="form">
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="postChannel">Subscribe to</label>
              <div className="col-sm-6">
                <ChannelPicker
                  ref={e => (this.subChannel = e)}
                  applicationId={this.props.params.id}
                  type={this.props.location.query.subChannelType || 'public'}
                  path={this.props.location.query.subChannelPath || ''}
                  updateParams={this.updateChannelParams.bind(this, 'subChannel')}
                  showPresence='1'
                  showMeta='1' />
              </div>
            </div>

            {this.renderPresenceFields()}

            <div className="form-group">
              <label className="col-sm-2 control-label"></label>
              <div className="col-sm-4">
                { this.state.subscribed
                  ? <button
                      type="submit"
                      onClick={this.handleUnsubscribe}
                      className="btn btn-default"
                      >Unsubscribe</button>
                  : <span>
                      <button
                        type="submit"
                        onClick={this.handleSubscribe}
                        disabled={this.channelButtonDisabled(this.props.location.query.subChannelPath)}
                        className="btn btn-default"
                        >Subscribe</button> (for 50 events)
                    </span>
                }
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
