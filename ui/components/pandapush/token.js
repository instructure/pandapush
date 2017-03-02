import React from 'react';
import _ from 'lodash';

class Presence extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      token: null
    };
  }

  componentDidMount () {
    this.getToken(this.props);
  }

  componentWillReceiveProps (newProps) {
    if (!_.isEqual(newProps, this.props)) {
      this.getToken(newProps);
    }
  }

  getToken (props) {
    fetch(`/admin/api/application/${props.appId}/token`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        channel: props.channel,
        presence: props.presence,
        pub: props.pub,
        sub: props.sub
      })
    }).then(response => response.json())
      .then(json => {
        this.setState({ token: json.token });
      })
      .catch(e => {
        console.log('error getting token', e);
      });
  }

  render () {
    return this.props.children(this.state.token);
  }
}

Presence.propTypes = {
  children: React.PropTypes.func.isRequired,
  appId: React.PropTypes.string.isRequired,
  channel: React.PropTypes.string.isRequired,
  presence: React.PropTypes.object,
  pub: React.PropTypes.bool,
  sub: React.PropTypes.bool
};

module.exports = Presence;
