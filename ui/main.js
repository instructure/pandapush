import React from "react";
import { render } from "react-dom";
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
  Link,
  hashHistory
} from "react-router";
import Applications from "./components/applications";
import Application from "./components/application";
import ApplicationInfo from "./components/application/info";
import ApplicationKeys from "./components/application/keys";
import ApplicationConsole from "./components/application/console";
import ApplicationLoadTest from "./components/application/loadtest";

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
          username: json.username
        });
      })
      .catch(e => {
        console.log("parsing failed", e);
      });
  }

  render() {
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
                  <Link to="/">Applications</Link>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
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

        {React.cloneElement(this.props.children, {
          username: this.state.username
        })}
      </div>
    );
  }
}

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Applications} />
      <Route path="application/:id" component={Application}>
        <IndexRedirect to="info" />
        <Route path="info" component={ApplicationInfo} />
        <Route path="keys" component={ApplicationKeys} />
        <Route path="console" component={ApplicationConsole} />
        <Route path="loadtest" component={ApplicationLoadTest} />
      </Route>
    </Route>
  </Router>,
  document.getElementById("root")
);
