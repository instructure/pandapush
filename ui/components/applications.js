import React from "react";
import { Link } from "@reach/router";
import _ from "lodash";
import Table from "@instructure/ui-elements/lib/components/Table";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import Button from "@instructure/ui-buttons/lib/components/Button";
import IconAdd from "@instructure/ui-icons/lib/Solid/IconAdd";

import NewApplicationModal from "./new_application";

class Applications extends React.Component {
  state = {
    applications: [],
    newApplicationModal: false
  };

  componentDidMount() {
    fetch("/admin/api/applications", { credentials: "same-origin" })
      .then(response => response.json())
      .then(json => {
        const applications = _.sortBy(json, o => [
          o.name.toLowerCase(),
          o.created_at
        ]);
        this.setState({ applications });
      })
      .catch(e => {
        console.log("error getting applications", e);
      });
  }

  renderApplications() {
    return _.map(this.state.applications, function(app) {
      return (
        <tr key={app.id}>
          <th scope="row">
            <Link to={`application/${app.id}`}>
              <pre>{app.id}</pre>
            </Link>
          </th>
          <td>{app.name}</td>
          <td>{app.created_at}</td>
          <td>{app.created_by}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ float: "right" }}>
          <Button
            onClick={() => this.setState({ newApplicationModal: true })}
            icon={<IconAdd />}
          >
            New Application
          </Button>
        </div>
        <Table
          caption={<ScreenReaderContent>Applications</ScreenReaderContent>}
          striped="rows"
        >
          <thead>
            <tr>
              <th scope="col">Application ID</th>
              <th scope="col">Name</th>
              <th scope="col">Created</th>
              <th scope="col">Created By</th>
            </tr>
          </thead>
          <tbody>{this.renderApplications()}</tbody>
        </Table>

        {this.state.newApplicationModal && (
          <NewApplicationModal
            onClose={() => this.setState({ newApplicationModal: false })}
            onCreated={applicationId =>
              this.props.navigate(`application/${applicationId}`)
            }
          />
        )}
      </div>
    );
  }
}

export default Applications;
