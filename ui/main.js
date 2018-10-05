import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import Applications from "./components/applications";
import Application from "./components/application";
import NewApplication from "./components/new_application";
import EnvironmentSelector from "./components/environment_selector";
import Grid, {
  GridCol,
  GridRow
} from "@instructure/ui-layout/lib/components/Grid";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Button from "@instructure/ui-buttons/lib/components/Button";
import View from "@instructure/ui-layout/lib/components/View";

import theme from "@instructure/ui-themes/lib/canvas";
theme.use();

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
      <View>
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#eee"
          }}
        >
          <Grid vAlign="middle">
            <GridRow>
              <GridCol width="auto">
                <Heading>Pandapush</Heading>
              </GridCol>
              <GridCol>
                <Button href="/admin">Home</Button>
              </GridCol>
              <GridCol width="auto">
                <EnvironmentSelector
                  environment={this.state.environment || "local"}
                  environments={this.state.environments || []}
                />
              </GridCol>
              <GridCol width="auto">
                Logged in as <b>{this.state.username}</b>
              </GridCol>
              <GridCol width="auto">
                <Button href="/logout">Logout</Button>
              </GridCol>
            </GridRow>
          </Grid>
        </div>

        <Router>
          <Applications path="/" {...childProps} />
          <NewApplication path="application/new" {...childProps} />
          <Application path="application/:application_id/*" {...childProps} />
        </Router>

        <div style={{ padding: "10px", float: "right" }}>
          <span style={{ color: "grey" }}>release</span>
          &nbsp;
          {this.state.version || "N/A"}
        </div>
      </View>
    );
  }
}

render(
  <Router basepath="/admin">
    <App path="/*" />
  </Router>,
  document.getElementById("root")
);
