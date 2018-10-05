import React from "react";
import { Router } from "@reach/router";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import TabList, { TabPanel } from "@instructure/ui-tabs/lib/components/TabList";

import Pandapush from "../../client/dist/client";
import Info from "./application/info";
import Console from "./application/console";
import Keys from "./application/keys";

const MyRedirect = ({ to, navigate }) => {
  navigate(to, { replace: true });
  return <div />;
};

const TABS = ["info", "keys", "console"];

class Application extends React.Component {
  state = {
    app: {
      id: "?",
      keys: {},
      admins: []
    },
    stats: {}
  };

  loadData() {
    fetch("/admin/api/application/" + this.props.application_id, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ app: json });
      })
      .catch(e => {
        console.log("error getting applications", e);
      });
  }

  handleStats(source, received, stats) {
    this.setState(state => {
      let newStats = state.stats; // technically should clone this
      newStats[source] = {
        received: received,
        stats: stats
      };
      return { stats: newStats };
    });
  }

  getToken(appId, channel, presence, done) {
    fetch("/admin/api/application/" + appId + "/token", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        channel: channel,
        presence: presence,
        pub: true,
        sub: true
      })
    })
      .then(response => response.json())
      .then(json => {
        done(null, json.token);
      })
      .catch(e => {
        console.log("error getting token", e);
      });
  }

  createClient() {
    this.client = new Pandapush.Client("/push");
    this.client.addExtension({
      outgoing: (message, callback) => {
        if (message.channel === "/meta/subscribe") {
          if (message.ext && message.ext.auth) {
            callback(message);
            return;
          }

          // get a token (cause we didn't already have one)
          this.getToken(
            this.props.application_id,
            message.subscription,
            null,
            (err, token) => {
              if (err) {
                alert("error getting a token: " + err);
                return;
              }

              if (!message.ext) message.ext = {};
              message.ext.auth = { token: token };
              callback(message);
            }
          );
        } else {
          callback(message);
        }
      }
    });
  }

  componentDidMount() {
    this.loadData();

    this.createClient();
    this.client.subscribe(
      "/" + this.props.application_id + "/meta/statistics",
      msg => {
        this.handleStats(msg.data.source, msg.received, msg.data.stats);
      }
    );
  }

  handleReload = e => {
    this.loadData();
  };

  render() {
    const childProps = {
      app: this.state.app,
      reload: this.handleReload,
      client: this.client,
      getToken: this.getToken,
      username: this.props.username
    };

    const tabListIndex = TABS.indexOf(this.props["*"]);

    return (
      <div className="container">
        <Heading>
          {this.state.app.name}{" "}
          <span style={{ fontSize: "0.6em" }}>
            (<span className="identifier">{this.props.application_id}</span>)
          </span>
        </Heading>

        <br />

        <TabList
          selectedIndex={tabListIndex}
          onChange={index => {
            this.props.navigate(`./${TABS[index]}`);
          }}
        >
          <TabPanel title="Info" />
          <TabPanel title="Keys" />
          <TabPanel title="Console" />
        </TabList>

        <Router>
          <Info path="info" {...childProps} />
          <Console path="console" {...childProps} />
          <Keys path="keys" {...childProps} />
          <MyRedirect default path="/" to="info" />
        </Router>
      </div>
    );
  }
}

export default Application;
