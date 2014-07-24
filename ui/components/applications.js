/** @jsx React.DOM */

'use strict';

var React        = require('react'),
    Router       = require('react-nested-router'),
    Route        = Router.Route,
    Link         = Router.Link,
    moment       = require('moment'),
    _            = require('lodash'),
    Faye         = window.Faye,
    $            = window.jQuery;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      applications: []
    }
  },

  componentDidMount: function() {
    $.getJSON('/admin/api/applications', function(data) {
      this.setState({
        applications: data
      });
    }.bind(this));
  },

  handleAppSubmit: function(e) {
    e.preventDefault();

    var name = this.refs["appName"].getDOMNode().value;

    if (!name) {
      alert("Name is required!");
      return false;
    }

    $.ajax({
      type: 'POST',
      url: '/admin/api/applications',
      data: JSON.stringify({
        name: name
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data) {
        Router.transitionTo("application", { id: data.application_id });
      }.bind(this)
    });

    return false;
  },

  renderApplications: function() {
    return _.map(this.state.applications, function(app) {
      return (
        <tr>
          <td><Link to="application" id={app.application_id} app={app}>{app.application_id}</Link></td>
          <td>{app.name}</td>
          <td>{app.created_at}</td>
        </tr>
      );
    }.bind(this));
  },

  render: function() {
    return (
      <div className="container">
        <h1>Applications</h1>

        <table className="table">
          <tbody>
            <tr>
              <th>Application ID</th>
              <th>Name</th>
              <th>Created</th>
            </tr>

            {this.renderApplications()}
          </tbody>
        </table>

        <h2>Create Application</h2>

        <form onSubmit={this.handleAppSubmit} className="form-horizontal" role="form">
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="appName">Name</label>
            <div className="col-sm-6">
              <input type="text" className="form-control" ref="appName" name="name" id="appName" />
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
});
