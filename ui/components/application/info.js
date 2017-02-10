import React from 'react';

class Info extends React.Component {
  render() {
    return (
      <div className="container">
        <table className="table">
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td className="identifier">{this.props.params.id}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{this.props.app.name}</td>
            </tr>
            <tr>
              <td>Created At</td>
              <td>{this.props.app.created_at}</td>
            </tr>
            <tr>
              <td>Created By</td>
              <td>{this.props.app.created_by}</td>
            </tr>
            <tr>
              <td>Admins</td>
              <td>{this.props.app.admins.join(", ")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = Info;