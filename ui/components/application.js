import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Pandapush from '../../client/dist/client';

class Application extends React.Component {
  state = {
    app: {
      id: '?',
      keys: {},
      admins: []
    },
    stats: {}
  }

  loadData () {
    fetch('/admin/api/application/' + this.props.params.id, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => {
        this.setState({ app: json });
      })
      .catch(e => {
        console.log('error getting applications', e);
      });
  }

  handleStats (source, received, stats) {
    this.state.stats[source] = {
      received: received,
      stats: stats
    };

    this.forceUpdate();
  }

  getToken (appId, channel, presence, done) {
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
        done(null, json.token);
      })
      .catch(e => {
        console.log('error getting token', e);
      });
  }

  createClient () {
    this.client = new Pandapush.Client('/push');
    this.client.addExtension({
      outgoing: (message, callback) => {
        if (message.channel === '/meta/subscribe') {
          if (message.ext && message.ext.auth) {
            callback(message);
            return;
          }

          // get a token (cause we didn't already have one)
          this.getToken(this.props.params.id, message.subscription, null, (err, token) => {
            if (err) {
              alert('error getting a token: ' + err);
              return;
            }

            if (!message.ext) message.ext = {};
            message.ext.auth = { token: token };
            callback(message);
          });
        } else {
          callback(message);
        }
      }
    });
  }

  componentDidMount () {
    this.loadData();

    this.createClient();
    this.client.subscribe('/' + this.props.params.id + '/meta/statistics', (msg) => {
      this.handleStats(msg.data.source, msg.received, msg.data.stats);
    });
  }

  handleReload = (e) => {
    this.loadData();
  }

  render () {
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
}

module.exports = Application;
