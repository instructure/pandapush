/** @jsx React.DOM */

'use strict';

var React = require('react'),
    $     = window.jQuery;

module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  handleType: function(val) {
    return function(e) {
      this.setState({
        type: val
      });

      this.props.updateParams({
        channelType: val,
        path: this.refs["path"].getDOMNode().value
      });

      return false;
    }.bind(this);
  },

  updateParams: function() {
    this.props.updateParams({
      channelType: this.state.type || this.props.type,
      path: this.refs["path"].getDOMNode().value
    });
  },

  get: function() {
    return '/' + this.props.applicationId +
           '/' + (this.state.type || this.props.type) +
           '/' + this.refs["path"].getDOMNode().value;
  },

  render: function() {
    return (
      <div className="input-group">
        <div className="input-group-btn">
          <button type="button" className="btn btn-default" disabled="disabled">/</button>
          <button type="button" className="btn btn-default identifier">{this.props.applicationId}</button>
          <button type="button" className="btn btn-default" disabled="disabled">/</button>
          <div className="btn-group">
            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">{this.state.type || this.props.type} <span className="caret"></span></button>
            <ul className="dropdown-menu" role="menu">
              <li><a onClick={this.handleType('public')} href="#">public</a></li>
              <li><a onClick={this.handleType('private')} href="#">private</a></li>
              <li className={this.props.showPresence ? '' : 'hidden'}><a onClick={this.handleType('presence')} href="#">presence</a></li>
              <li className={this.props.showMeta ? '' : 'hidden'}><a onClick={this.handleType('meta')} href="#">meta</a></li>
            </ul>
          </div>
          <button type="button" className="btn btn-default" disabled="disabled">/</button>
        </div>
        <input onChange={this.updateParams} type="text" ref="path" className="form-control" value={this.props.path} />
      </div>
    );
  }
});
