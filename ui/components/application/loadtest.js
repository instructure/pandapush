import React from "react";
import moment from "moment";
import _ from "lodash";
import Presence from "../pandapush/presence";
import Token from "../pandapush/token";
import PropTypes from "prop-types";

class LoadTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workers: {},
      workersStatus: {},
      presenceChannel: `/${this.props.params.id}/presence/workers`
    };
  }

  componentWillUnmount() {
    if (this.jobSubscription) {
      this.jobSubscription.cancel();
      this.jobSubscription = null;
    }
  }

  handleFieldChange = (field, e) => {
    const params = this.props.location.query;
    const value = this[field].value;
    if (value.length > 1024) {
      params[field] = "";
    } else {
      params[field] = value;
    }

    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: params
    });
  };

  handleStart = e => {
    e.preventDefault();

    const jobInfo = {
      testId: this.testId.value,
      url: this.pandapushBase.value,
      appid: this.applicationId.value,
      keyid: this.keyId.value,
      secret: this.keySecret.value,
      numusers: this.numusers.value,
      ppu: this.ppu.value,
      pushrate: this.pushrate.value
    };

    const testChannel = `/${this.props.params.id}/private/${jobInfo.testId}/**`;

    if (this.jobSubscription) {
      this.jobSubscription.cancel();
      this.jobSubscription = null;
    }

    this.props.getToken(
      this.props.params.id,
      `/${this.props.params.id}/private/**`,
      null,
      (err, token) => {
        if (err) {
          alert("Error getting token", err);
          return;
        }

        this.jobSubscription = this.props.client.subscribeTo(
          testChannel,
          token,
          (message, channel) => {
            const components = channel.split("/");
            const workerId = components[components.length - 1];
            const workerStatus = _.merge(
              {},
              this.state.workersStatus[workerId] || {},
              message,
              {
                received: moment()
              }
            );
            const workersStatus = _.merge({}, this.state.workersStatus, {
              [workerId]: workerStatus
            });
            this.setState({ workersStatus });
          }
        );

        this.jobSubscription.then(() => {
          this.setState({ workersStatus: {} });
          this.props.client.publishTo(
            `/${this.props.params.id}/private/jobs`,
            token,
            jobInfo
          );
        });
      }
    );
  };

  renderWorkerRows(workers) {
    const sums = {
      subscribed: 0,
      waitingPush: 0,
      waitingReceive: 0,
      failedSubscribe: 0,
      failedPublish: 0
    };

    const workerRows = _.map(_.omit(workers, "console"), (worker, name) => {
      const className = worker.done ? "success" : "";
      const status = this.state.workersStatus[name] || {};

      sums.subscribed += status.subscribed || 0;
      sums.waitingPush += status.waitingPush || 0;
      sums.waitingReceive += status.waitingReceive || 0;
      sums.failedSubscribe += status.failedSubscribe || 0;
      sums.failedPublish += status.failedPublish || 0;

      return (
        <tr key={name} className={className}>
          <td>{name}</td>
          <td>{status.received ? moment(status.received).fromNow() : ""}</td>
          <td>{status.subscribed}</td>
          <td>{status.waitingPush}</td>
          <td>{status.waitingReceive}</td>
          <td>{status.failedSubscribe}</td>
          <td>{status.failedPublish}</td>
        </tr>
      );
    });

    workerRows.unshift(
      <tr key="sums" className="active">
        <td>Totals</td>
        <td />
        <td>{sums.subscribed}</td>
        <td>{sums.waitingPush}</td>
        <td>{sums.waitingReceive}</td>
        <td>{sums.failedSubscribe}</td>
        <td>{sums.failedPublish}</td>
      </tr>
    );

    return workerRows;
  }

  renderWorkers() {
    return (
      <Token
        appId={this.props.params.id}
        channel={this.state.presenceChannel}
        presence={{ id: "console" }}
        sub={true}
      >
        {token =>
          token ? (
            <Presence
              channel={this.state.presenceChannel}
              token={token}
              client={this.props.client}
            >
              {workers => (
                <div className="row">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Last Msg</th>
                        <th>Subscribed</th>
                        <th>Waiting Push</th>
                        <th>Waiting Receive</th>
                        <th>Failed Subscribe</th>
                        <th>Failed Publish</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderWorkerRows(workers)}</tbody>
                  </table>
                </div>
              )}
            </Presence>
          ) : null
        }
      </Token>
    );
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleStart} className="form">
          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">Test ID</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "testId")}
                  ref={e => (this.testId = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.testId}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">Pandapush Base</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "pandapushBase")}
                  ref={e => (this.pandapushBase = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.pandapushBase}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">Application ID</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "applicationId")}
                  ref={e => (this.applicationId = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.applicationId}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">Key ID</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "keyId")}
                  ref={e => (this.keyId = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.keyId}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">Key Secret</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "keySecret")}
                  ref={e => (this.keySecret = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.keySecret}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">Number of Users</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "numusers")}
                  ref={e => (this.numusers = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.numusers}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">Pushes per User</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "ppu")}
                  ref={e => (this.ppu = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.ppu}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label className="col-sm-2 control-label">
                Pushes per Second
              </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.handleFieldChange.bind(this, "pushrate")}
                  ref={e => (this.pushrate = e)}
                  className="form-control"
                  defaultValue={this.props.location.query.pushrate}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <button
              type="submit"
              onClick={this.handleStart}
              className="btn btn-default"
            >
              Start
            </button>
          </div>

          <div className="row">
            <hr />
          </div>

          <h2>Workers</h2>
          {this.renderWorkers()}
        </form>
      </div>
    );
  }
}

LoadTest.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoadTest;
