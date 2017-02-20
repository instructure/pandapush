import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

class Applications extends React.Component {
  state = {
    applications: []
  }

  componentDidMount () {
    fetch('/admin/api/applications', { credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => {
        this.setState({ applications: json });
      })
      .catch(e => {
        console.log('error getting applications', e);
      });
  }

  handleAppSubmit = (e) => {
    e.preventDefault();

    const name = this.newAppNameInput.value;

    if (!name) {
      alert('Name is required!');
      return false;
    }

    fetch('/admin/api/applications', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        name: name
      })
    }).then(response => response.json())
      .then(json => {
        this.context.router.push({
          pathname: `/application/${json.id}`
        });
      })
      .catch(e => {
        console.log('error creating application', e);
      });

    return false;
  }

  renderApplications () {
    return _.map(this.state.applications, function (app) {
      return (
        <tr key={app.id}>
          <td className="identifier">
            <Link to={`/application/${app.id}`}>{app.id}</Link>
          </td>
          <td>{app.name}</td>
          <td>{app.created_at}</td>
          <td>{app.created_by}</td>
        </tr>
      );
    });
  }

  render () {
    return (
      <div className="container">
        <h1>Applications</h1>

        <table className="table">
          <tbody>
            <tr>
              <th>Application ID</th>
              <th>Name</th>
              <th>Created</th>
              <th>Created By</th>
            </tr>

            {this.renderApplications()}
          </tbody>
        </table>

        <h2>Create Application</h2>

        <form onSubmit={this.handleAppSubmit} className="form-horizontal" role="form">
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="appName">Name</label>
            <div className="col-sm-6">
              <input type="text" className="form-control" ref={e => (this.newAppNameInput = e)} name="name" id="appName" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label"></label>
            <div className="col-sm-4">
              <button type="submit" className="btn btn-default">Create</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Applications.contextTypes = {
  router: React.PropTypes.object.isRequired
};

module.exports = Applications;
