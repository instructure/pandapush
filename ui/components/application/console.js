import React from "react";
import moment from "moment";
import _ from "lodash";
import qs from "query-string";
import CodeEditor from "@instructure/ui-code-editor/lib/components/CodeEditor";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Button from "@instructure/ui-buttons/lib/components/Button";
import TextInput from "@instructure/ui-forms/lib/components/TextInput";
import Tag from "@instructure/ui-elements/lib/components/Tag";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
import Table from "@instructure/ui-elements/lib/components/Table";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";

import ChannelPicker from "../channel_picker";

export default class Console extends React.Component {
  constructor(props) {
    super(props);

    const query = qs.parse(this.props.location.search);
    this.state = {
      subChannel: null,
      presence: query && query.subChannelType === "presence",
      events: [],
      subscribers: {}
    };
  }

  handlePublish = (useClient, e) => {
    const channel = this.pubChannel.get();
    let payload = this.pubPayloadInput.value;
    if (payload === "") {
      payload = "{}";
    }

    try {
      payload = JSON.parse(payload);
    } catch (e) {
      alert("Payload must be valid JSON.\n\n" + e.message);
      return;
    }

    this.props.getToken(this.props.app.id, channel, null, (err, token) => {
      window.pp = this.props.client;

      if (err) {
        alert("error getting token.\n\n" + err);
        return;
      }

      if (useClient) {
        this.props.client.publishTo(channel, token, payload).then(
          () => {
            this.setState({ publishStatus: true });
          },
          err => {
            this.setState({
              publishStatus: {
                body: JSON.stringify(err)
              }
            });
          }
        );
      } else {
        fetch("/channel" + channel + "?token=" + token, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(payload)
        }).then(response => {
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
  };

  handleUnsubscribe = e => {
    e.preventDefault();

    this.currentSubscription.cancel();
    this.currentSubscription = null;

    this.setState({
      subscribed: false
    });
  };

  handleSubscribe = e => {
    e.preventDefault();

    const channel = this.subChannel.get();

    const presence = channel.split("/")[2] === "presence";
    let presenceData = null;

    if (presence) {
      const presenceId = this.presenceIdInput.value || this.props.username;
      presenceData = {};
      const rawPresenceData = this.presenceDataInput.value || "{}";
      if (rawPresenceData) {
        try {
          presenceData = JSON.parse(rawPresenceData);
        } catch (e) {
          alert("Presence Data must be valid JSON.\n\n" + e.message);
          return;
        }
      }
      presenceData.id = presenceId;
    }

    this.props.getToken(
      this.props.app.id,
      channel,
      presenceData,
      (err, token) => {
        if (err) {
          alert("Error getting token", err);
          return;
        }

        this.currentSubscription = this.props.client.subscribeTo(
          channel,
          token,
          (message, channel) => {
            const event = {
              data: message,
              channel: channel,
              received: moment()
            };

            this.setState(state => {
              let events = state.events;
              events.splice(0, 0, event);
              events = events.splice(0, 50);
              let newState = { events };

              if (events.length >= 50) {
                if (this.currentSubscription) {
                  this.currentSubscription.cancel();
                  this.currentSubscription = null;
                }

                newState.subscribed = false;
              }

              return newState;
            });

            if (presence) {
              const subscribers = this.state.subscribers || {};

              const updatedSubscribers = _({})
                .extend(subscribers, message.subscribe || {})
                .omit(_.keys(message.unsubscribe))
                .value();

              this.setState({
                subscribers: updatedSubscribers
              });
            }
          }
        );

        this.currentSubscription.then(() => {
          this.setState({ subscribing: false });
        });
      }
    );

    this.setState({
      subChannel: channel,
      subscribed: true,
      subscribing: true,
      subscribers: {},
      events: []
    });
  };

  updateChannelParams = (channel, newParams) => {
    const params = qs.parse(this.props.location.search);
    params[channel + "Type"] = newParams.channelType;
    params[channel + "Path"] = newParams.path;

    this.props.navigate(
      `${this.props.location.pathname}?${qs.stringify(params)}`,
      { replace: true }
    );

    this.setState({
      presenceSub: newParams.channelType === "presence"
    });
  };

  handleFieldChange = (field, e) => {
    const params = qs.parse(this.props.location.search);
    let value = null;
    if (typeof e === "string") {
      value = e;
    } else {
      value = e.target.value;
    }

    if (value.length > 1024) {
      params[field] = "";
    } else {
      params[field] = value;
    }

    this.props.navigate(
      `${this.props.location.pathname}?${qs.stringify(params)}`,
      { replace: true }
    );
  };

  renderEventsTable() {
    if (this.state.events.length === 0) {
      return (
        <div>
          <br />
          Nothing yet.
        </div>
      );
    }

    const ary = this.state.subChannel.split("*", 2);
    let prefix = null;
    if (ary.length > 1) {
      prefix = ary[0];
    }

    const events = _(this.state.events)
      .omit(ev => !ev.channel)
      .map((ev, index) => {
        const shortenedChannel = ev.channel.replace(prefix, "");
        let channelTd = null;
        if (prefix) {
          channelTd = <td>{shortenedChannel}</td>;
        }

        return (
          <tr key={`${ev.channel}-${ev.received && ev.received.toISOString()}`}>
            {channelTd}
            <td>{ev.received && ev.received.toISOString()}</td>
            <td>
              <pre>{JSON.stringify(ev.data, null, 2)}</pre>
            </td>
          </tr>
        );
      })
      .value();

    const channelTh = prefix ? <th scope="col">Channel</th> : null;

    return (
      <Table
        caption={<ScreenReaderContent>Events</ScreenReaderContent>}
        striped="rows"
      >
        <thead>
          <tr>
            {channelTh}
            <th scope="col">Received</th>
            <th scope="col">Payload</th>
          </tr>
        </thead>
        <tbody>{events}</tbody>
      </Table>
    );
  }

  renderEvents() {
    if (!this.state.subChannel) {
      return null;
    }

    let subscribedImg = null;
    if (this.state.subscribed) {
      subscribedImg = <Spinner title="Loading" size="x-small" />;
    }

    return (
      <div>
        <div style={{ float: "right" }}>
          {this.state.events.length}{" "}
          {this.state.events.length === 1 ? "event" : "events"}
        </div>
        <Heading level="h4">
          {subscribedImg} <tt>{this.state.subChannel}</tt>
        </Heading>

        {this.renderEventsTable()}
      </div>
    );
  }

  renderSubscribers() {
    const query = qs.parse(this.props.location.search);

    if (!(query.subChannelType === "presence" && this.state.subChannel)) {
      return <span />;
    }

    const subscribers = _.map(this.state.subscribers, (data, id) => {
      return <Tag key={id} text={id} margin="xx-small" />;
    });

    return (
      <div>
        <Heading>Subscribers</Heading>
        {subscribers}
      </div>
    );
  }

  renderPresenceFields() {
    const query = qs.parse(this.props.location.search);

    if (query.subChannelType === "presence") {
      return (
        <div>
          <br />
          <TextInput
            label="Presence ID"
            required
            value={this.state.purpose}
            onChange={this.handleFieldChange.bind(this, "presenceIdInput")}
            ref={e => (this.presenceIdInput = e)}
            placeholder={this.props.username}
            defaultValue={query.presenceIdInput}
          />

          <br />

          <Heading level="h4">Presence Data (JSON)</Heading>
          <div
            style={{
              width: "50%"
            }}
          >
            <CodeEditor
              label="Presence Data (JSON)"
              defaultValue={query.presenceDataInput || "{}"}
              onChange={this.handleFieldChange.bind(this, "presenceDataInput")}
              language="json"
              ref={el => (this.presenceDataInput = el)}
            />
          </div>
        </div>
      );
    }

    return <span />;
  }

  renderPublishStatus() {
    if (this.state.publishStatus === true) {
      return (
        <span style={{ paddingLeft: "10px" }} className="text-success">
          Sent.
        </span>
      );
    }

    if (this.state.publishStatus) {
      return (
        <span style={{ paddingLeft: "10px" }}>
          <span className="text-danger">
            {this.state.publishStatus.statusText}
          </span>
          &nbsp;
          <span className="text-warning">
            [{this.state.publishStatus.status}]
          </span>
          &nbsp;
          <span className="text-muted">{this.state.publishStatus.body}</span>
        </span>
      );
    }
  }

  channelButtonDisabled(path) {
    return typeof path === "undefined" || path === "" || path.slice(-1) === "/";
  }

  render() {
    const query = qs.parse(this.props.location.search);

    const separator = (
      <div style={{ borderTop: "1px solid #eee", margin: "20px 0" }} />
    );

    return (
      <div className="container" style={{ padding: "10px 100px" }}>
        <Heading>Publish To</Heading>

        <ChannelPicker
          ref={e => (this.pubChannel = e)}
          applicationId={this.props.app.id}
          type={query.pubChannelType || "public"}
          path={query.pubChannelPath || ""}
          updateParams={this.updateChannelParams.bind(this, "pubChannel")}
        />

        <br />
        <Heading level="h4">Payload (JSON)</Heading>
        <div
          style={{
            width: "50%"
          }}
        >
          <CodeEditor
            label="Payload JSON"
            defaultValue={query.pubPayloadInput || "{}"}
            onChange={this.handleFieldChange.bind(this, "pubPayloadInput")}
            language="json"
            ref={el => (this.pubPayloadInput = el)}
          />
        </div>

        <br />

        <Button
          onClick={this.handlePublish.bind(this, true)}
          disabled={this.channelButtonDisabled(query.pubChannelPath)}
          margin="0 x-small 0 0"
        >
          Publish (client)
        </Button>
        <Button
          onClick={this.handlePublish.bind(this, false)}
          disabled={this.channelButtonDisabled(query.pubChannelPath)}
          margin="0 x-small 0 0"
        >
          Publish (REST)
        </Button>

        {this.renderPublishStatus()}

        {separator}

        <Heading>Subscribe To</Heading>

        <ChannelPicker
          ref={e => (this.subChannel = e)}
          applicationId={this.props.app.id}
          type={query.subChannelType || "public"}
          path={query.subChannelPath || ""}
          updateParams={this.updateChannelParams.bind(this, "subChannel")}
          showPresence="1"
          showMeta="1"
        />

        {this.renderPresenceFields()}

        <br />
        {this.state.subscribed ? (
          <Button onClick={this.handleUnsubscribe}>Unsubscribe</Button>
        ) : (
          <span>
            <Button
              onClick={this.handleSubscribe}
              disabled={this.channelButtonDisabled(query.subChannelPath)}
            >
              Subscribe
            </Button>{" "}
            (for 50 events)
          </span>
        )}

        {separator}

        {this.renderSubscribers()}
        <br />
        {this.renderEvents()}
      </div>
    );
  }
}
