/** @jsx React.DOM */

'use strict';

var React              = require('react'),
    Router             = require('react-router'),
    Route              = Router.Route,
    Link               = Router.Link,
    Faye               = window.Faye,
    $                  = window.jQuery,
    Applications       = require('./components/applications'),
    Application        = require('./components/application'),
    ApplicationInfo    = require('./components/application/info'),
    ApplicationKeys    = require('./components/application/keys'),
    ApplicationConsole = require('./components/application/console');

window.React = React; // for the React chrome extension

var App = React.createClass({
  getInitialState: function() {
    return {
      username: ""
    };
  },

  componentDidMount: function() {
    if (!this.props.activeRouteHandler()) {
      Router.replaceWith('applications');
    }

    $.getJSON('/admin/api/info', function(data) {
      this.setState({
        username: data.username
      });
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Pandapush</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li>
                  <Link to="applications">Applications</Link>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li><p className="navbar-text">Logged in as {this.state.username}</p></li>
                <li><a href="/admin/logout">Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {this.props.activeRouteHandler({ username: this.state.username })}
      </div>
    );
  }
});

React.renderComponent((
  <Route handler={App}>
    <Route path="/applications" name="applications" handler={Applications} />
    <Route path="/application/:id" name="application" handler={Application}>
      <Route path="/application/:id/info" name="applicationInfo" handler={ApplicationInfo} />
      <Route path="/application/:id/keys" name="applicationKeys" handler={ApplicationKeys} />
      <Route path="/application/:id/console" name="applicationConsole" handler={ApplicationConsole} />
    </Route>
  </Route>
), document.body);
