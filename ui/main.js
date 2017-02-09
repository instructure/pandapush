'use strict';

var React              = require('react'),
    render             = require('react-dom').render,
    Router             = require('react-router').Router,
    Route              = require('react-router').Route,
    IndexRoute         = require('react-router').IndexRoute,
    IndexRedirect      = require('react-router').IndexRedirect,
    Link               = require('react-router').Link,
    hashHistory        = require('react-router').hashHistory,
    Faye               = window.Faye,
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
    fetch('/admin/api/info', { credentials: 'same-origin', })
      .then(response => response.json())
      .then(json => {
        this.setState({
          username: json.username
        });
      }).catch(e => {
        console.log('parsing failed', e);
      });
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
                  <Link to="/">Applications</Link>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li><p className="navbar-text">Logged in as {this.state.username}</p></li>
                <li><a href="/admin/logout">Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {React.cloneElement(this.props.children, { username: this.state.username })}
      </div>
    );
  }
});

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Applications} />
      <Route path="application/:id" component={Application}>
        <IndexRedirect to="info" />
        <Route path="info" component={ApplicationInfo} />
        <Route path="keys" component={ApplicationKeys} />
        <Route path="console" component={ApplicationConsole} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'));
