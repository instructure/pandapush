import React from "react";
import Table from "@instructure/ui-elements/lib/components/Table";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import Button from "@instructure/ui-buttons/lib/components/Button";
import IconAdd from "@instructure/ui-icons/lib/Solid/IconAdd";
import NewKeyModal from "./new_key";

import moment from "moment";
import _ from "lodash";

export default class Keys extends React.Component {
  state = {
    newKeyModal: false
  };

  renderKeys() {
    return _(this.props.app.keys)
      .values()
      .sortBy("created_at")
      .map(key => {
        let status = "active";
        if (key.revoked_at) {
          status = "revoked " + key.revoked_at;
        } else if (moment(key.expires).isBefore(moment())) {
          status = "expired";
        }

        let lastUsedString = "";
        if (key.last_used) {
          lastUsedString = moment(key.last_used).fromNow();
        }

        return (
          <tr key={key.id}>
            <td className="identifier">{key.id}</td>
            <td>{key.purpose}</td>
            <td>
              {moment(key.created_at).fromNow()} ({key.created_by})
            </td>
            <td>{moment(key.expires).fromNow()}</td>
            <td>{status}</td>
            <td>{lastUsedString}</td>
            <td>{key.use_count}</td>
          </tr>
        );
      })
      .value();
  }

  render() {
    return (
      <div>
        <div style={{ float: "right" }}>
          <Button
            onClick={() => {
              this.setState({ newKeyModal: true });
            }}
          >
            <IconAdd /> New Key
          </Button>
        </div>

        <Table
          caption={<ScreenReaderContent>Keys</ScreenReaderContent>}
          striped="rows"
        >
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Purpose</th>
              <th scope="col">Created</th>
              <th scope="col">Expires</th>
              <th scope="col">Status</th>
              <th scope="col">Last Used</th>
              <th scope="col">Used</th>
            </tr>
          </thead>

          <tbody>{this.renderKeys()}</tbody>
        </Table>

        {this.state.newKeyModal && (
          <NewKeyModal
            applicationId={this.props.app.id}
            onClose={() => this.setState({ newKeyModal: false })}
            onCreated={() => {
              this.props.reload();
              this.setState({ newKeyModal: false });
            }}
          />
        )}
      </div>
    );
  }
}
