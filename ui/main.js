import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import Applications from "./components/applications";
import Application from "./components/application";
import EnvironmentSelector from "./components/environment_selector";

window.React = React; // for the React chrome extension

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
  }

  componentDidMount() {
    fetch("/admin/api/info", { credentials: "same-origin" })
      .then(response => response.json())
      .then(json => {
        this.setState({
          username: json.username,
          environment: json.environment,
          environments: json.environments,
          version: json.version
        });
      })
      .catch(e => {
        console.log("parsing failed", e);
      });
  }

  render() {
    const childProps = { username: this.state.username };

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="#/">
                Pandapush
              </a>
            </div>

            <div
              className="collapse navbar-collapse"
              id="bs-example-navbar-collapse-1"
            >
              <ul className="nav navbar-nav">
                <li>
                  <Link to="./">Applications</Link>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <EnvironmentSelector
                    environment={this.state.environment}
                    environments={this.state.environments || []}
                  />
                </li>
                <li>
                  <p className="navbar-text">
                    Logged in as {this.state.username}
                  </p>
                </li>
                <li>
                  <a href="/logout">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Router>
          <Applications path="/" {...childProps} />
          <Application path="application/:application_id/*" {...childProps} />
        </Router>

        <div className="container-fluid" style={{ float: "right" }}>
          <span>
            <span style={{ color: "grey" }}>release</span>
            &nbsp;
            {this.state.version || "N/A"}
          </span>
        </div>
      </div>
    );
  }
}

render(
  <Router basepath="/admin">
    <App path="/*" />
  </Router>,
  document.getElementById("root")
);
