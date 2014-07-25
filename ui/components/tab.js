/** @jsx React.DOM */

'use strict';

var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

var Tab = module.exports = React.createClass({
  mixins: [ Router.ActiveState ],

  getInitialState: function() {
    return {
      isActive: false
    };
  },

  updateActiveState: function() {
    this.setState({
      isActive: Tab.isActive(this.props.to, this.props.params, this.props.query)
    })
  },

  render: function() {
    return (
      <li className={this.state.isActive ? "active" : ""}>
        {Link(this.props)}
      </li>
    );
  }
});
