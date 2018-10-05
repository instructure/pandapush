import React from "react";
import Table from "@instructure/ui-elements/lib/components/Table";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import TextInput from "@instructure/ui-forms/lib/components/TextInput";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Tag from "@instructure/ui-elements/lib/components/Tag";

import AdminInput from "./admin_input";

class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }

  handleAdminChange = value => {
    this.setState({
      admins: value
    });
  };

  handleChange = (field, e) => {
    this.setState({
      [field]: e.target.value
    });
  };

  handleEdit = () => {
    this.setState({
      name: this.props.app.name,
      admins: this.props.app.admins,
      editing: true
    });
  };

  handleCancel = () => {
    this.setState({ editing: false });
  };

  handleSave = () => {
    fetch("/admin/api/application/" + this.props.app.id, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        name: this.state.name,
        admins: this.state.admins
      })
    })
      .then(response => response.json())
      .then(json => {
        this.props.reload();
        this.setState({
          name: null,
          admins: null,
          editing: false
        });
      })
      .catch(e => {
        console.log("error saving application", e);
        alert("error saving application", e);
      });
  };

  handleDelete = () => {
    if (
      prompt(
        'Are you sure you want to delete this app? Type "confirm" to continue.'
      ) === "confirm"
    ) {
      fetch(`/admin/api/application/${this.props.app.id}`, {
        method: "DELETE",
        credentials: "same-origin"
      })
        .then(response => {
          this.props.navigate("/admin");
        })
        .catch(e => {
          console.log("error deleting application", e);
          alert("error deleting application", e);
        });
    }
  };

  render() {
    return (
      <div className="container">
        <Table
          caption={<ScreenReaderContent>Application Info</ScreenReaderContent>}
        >
          <tbody>
            <tr>
              <th scope="row">ID</th>
              <td>
                <tt>{this.props.app.id}</tt>
              </td>
            </tr>

            <tr>
              <th scope="row">Name</th>
              <td>
                {this.state.editing ? (
                  <TextInput
                    label={<ScreenReaderContent>Name</ScreenReaderContent>}
                    value={this.state.name}
                    onChange={this.handleChange.bind(this, "name")}
                  />
                ) : (
                  this.props.app.name
                )}
              </td>
            </tr>

            <tr>
              <th scope="row">Created At</th>
              <td>{this.props.app.created_at}</td>
            </tr>

            <tr>
              <th scope="row">Created By</th>
              <td>{this.props.app.created_by}</td>
            </tr>

            <tr>
              <th scope="row">Admins</th>
              <td>
                {this.state.editing ? (
                  <AdminInput
                    onChange={this.handleAdminChange}
                    thisUser={this.props.username}
                    admins={this.state.admins}
                  />
                ) : (
                  this.props.app.admins.map(a => (
                    <Tag key={a} text={a} margin="0 xx-small 0 0" />
                  ))
                )}
              </td>
            </tr>
          </tbody>
        </Table>

        <br />

        {this.state.editing ? (
          <div>
            <Button variant="danger" disabled margin="0 x-small 0 0">
              Delete
            </Button>
            <Button
              variant="success"
              margin="0 x-small 0 0"
              onClick={this.handleSave}
            >
              Save
            </Button>
            <Button
              variant="light"
              margin="0 x-small 0 0"
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant="danger"
              margin="0 x-small 0 0"
              onClick={this.handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="primary"
              margin="0 x-small 0 0"
              onClick={this.handleEdit}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Info;
