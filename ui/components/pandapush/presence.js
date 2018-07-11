import React from "react";
import _ from "lodash";
import Pandapush from "../../../client/dist/client";

class Presence extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {}
    };
  }

  componentDidMount() {
    this.doSubscribe(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.channel !== this.props.channel ||
      newProps.token !== this.props.token
    ) {
      this.doSubscribe(newProps);
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.cancel();
      this.subscription = null;
    }
  }

  doSubscribe(props) {
    const client = props.client || new Pandapush.Client("/push");

    if (props.channel && props.token) {
      const oldSubscription = this.subscription;

      this.subscription = client.subscribeTo(
        props.channel,
        props.token,
        message => {
          const users = this.state.users;

          const updatedUsers = _({})
            .extend(users, message.subscribe || {})
            .omit(_.keys(message.unsubscribe))
            .value();

          this.setState({ users: updatedUsers });
        }
      );

      this.subscription.then(() => {
        if (oldSubscription) {
          oldSubscription.cancel();
        }
      });
    } else {
      if (this.subscription) {
        this.subscription.cancel();
        this.subscription = null;
      }
    }
  }

  render() {
    return this.props.children(this.state.users);
  }
}

Presence.propTypes = {
  children: React.PropTypes.func.isRequired
};

module.exports = Presence;
