/** @jsx React.DOM */

'use strict';

var React        = require('react'),
    Router       = require('react-router'),
    Route        = Router.Route,
    Link         = Router.Link,
    Tab          = require('./tab'),
    Info         = require('./application/info'),
    Keys         = require('./application/keys'),
    Console      = require('./application/console');

module.exports = React.createClass({
  mixins: [ Router.ActiveState ],

  getInitialState: function() {
    return {
      app: {
        application_id: "?",
        keys: {},
        admins: []
      },

    };
  },

  loadData: function() {
    $.getJSON('/admin/api/applications', function(data) {
      var app = _.find(data, { application_id: this.props.params.id });
      this.setState({ app: app });
    }.bind(this));
  },

  componentDidMount: function() {
    this.loadData();
  },

  handleReload: function() {
    this.loadData();
  },

  render: function() {
    return (
      <div className="container">
        <h1>{this.state.app.name} <span style={{'font-size': '0.6em'}}>(<span className="identifier">{this.props.params.id}</span>)</span></h1>

        <div className="row">
          <ul className="nav nav-tabs" role="tablist">
            <Tab to="applicationInfo" id={this.props.params.id}>Name</Tab>
            <Tab to="applicationKeys" id={this.props.params.id}>Keys</Tab>
            <Tab to="applicationConsole" id={this.props.params.id}>Console</Tab>
          </ul>

          <br />

          {this.props.activeRouteHandler({ app: this.state.app, reload: this.handleReload })}
        </div>
      </div>
    );
  }
});

