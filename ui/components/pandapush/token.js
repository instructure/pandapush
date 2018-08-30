import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

class Token extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null
    };
  }

  componentDidMount() {
    this.getToken(this.props);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props)) {
      this.getToken(this.props);
    }
  }

  getToken(props) {
    fetch(`/admin/api/application/${props.appId}/token`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        channel: props.channel,
        presence: props.presence,
        pub: props.pub,
        sub: props.sub
      })
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ token: json.token });
      })
      .catch(e => {
        console.log("error getting token", e);
      });
  }

  render() {
    return this.props.children(this.state.token);
  }
}

Token.propTypes = {
  children: PropTypes.func.isRequired,
  appId: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  presence: PropTypes.object,
  pub: PropTypes.bool,
  sub: PropTypes.bool
};

export default Token;
